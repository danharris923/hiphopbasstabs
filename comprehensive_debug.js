const { chromium } = require('playwright');

async function comprehensiveDebug() {
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('=== COMPREHENSIVE BASS TAB DEBUGGING ===\n');

  // Capture console logs
  const logs = [];
  page.on('console', msg => {
    logs.push(`${msg.type()}: ${msg.text()}`);
  });

  // Test 1: Check what the API ACTUALLY returns
  console.log('1. CHECKING API DIRECTLY');
  try {
    const response = await fetch('http://localhost:8000/api/pairs/');
    const tracks = await response.json();
    console.log(`   Current tracks: ${JSON.stringify(tracks)}`);
    
    for (let track of tracks) {
      const trackResponse = await fetch(`http://localhost:8000/api/pairs/${track}`);
      console.log(`   ${track}: Status ${trackResponse.status}`);
    }

    // Test the expected missing track
    const missingResponse = await fetch('http://localhost:8000/api/pairs/sugarhill-gang-rappers-delight');
    console.log(`   sugarhill-gang-rappers-delight: Status ${missingResponse.status}`);
    if (missingResponse.status !== 200) {
      const error = await missingResponse.json();
      console.log(`     Error: ${JSON.stringify(error)}`);
    }

  } catch (error) {
    console.log(`   API Error: ${error.message}`);
  }

  // Test 2: Frontend pairs page 
  console.log('\n2. TESTING FRONTEND /pairs PAGE');
  try {
    await page.goto('http://localhost:3033/pairs');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Get page title
    const title = await page.title();
    console.log(`   Page title: ${title}`);
    
    // Count track links
    await page.waitForSelector('a[href*="/pairs/"], .track-item, [data-testid="track"]', { timeout: 5000 });
    const trackLinks = await page.locator('a[href*="/pairs/"]').all();
    console.log(`   Number of track links: ${trackLinks.length}`);
    
    // Get all track details
    for (let i = 0; i < trackLinks.length; i++) {
      const link = trackLinks[i];
      const href = await link.getAttribute('href');
      const text = (await link.textContent()).trim();
      console.log(`   Track ${i+1}: "${text}" -> ${href}`);
    }

    // Look for the missing track specifically
    const missingTrackLink = await page.locator('a[href="/pairs/sugarhill-gang-rappers-delight"]').count();
    console.log(`   Sugarhill Gang link present: ${missingTrackLink > 0}`);

  } catch (error) {
    console.log(`   Frontend /pairs error: ${error.message}`);
  }

  // Test 3: Test a working individual track page
  console.log('\n3. TESTING INDIVIDUAL TRACK PAGE');
  try {
    await page.goto('http://localhost:3033/pairs/notorious-big-juicy');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Check for bass tab elements
    const tabElement = await page.locator('pre, .tab-display, [data-testid="bass-tab"]').first();
    const hasTab = await tabElement.count() > 0;
    console.log(`   Bass tab element found: ${hasTab}`);
    
    if (hasTab) {
      const tabText = await tabElement.textContent();
      console.log(`   Tab text preview: "${tabText.substring(0, 100)}..."`);
      
      // Check styling
      const computedStyle = await tabElement.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          color: style.color,
          backgroundColor: style.backgroundColor,
          fontFamily: style.fontFamily
        };
      });
      console.log(`   Tab styling: ${JSON.stringify(computedStyle)}`);
    }

    // Check for video
    const videoCount = await page.locator('iframe[src*="youtube"], iframe[src*="youtu.be"], video').count();
    console.log(`   Video elements: ${videoCount}`);

  } catch (error) {
    console.log(`   Track page error: ${error.message}`);
  }

  // Test 4: Try to access the missing track page directly
  console.log('\n4. TESTING MISSING TRACK PAGE');
  try {
    const response = await page.goto('http://localhost:3033/pairs/sugarhill-gang-rappers-delight');
    console.log(`   Response status: ${response.status()}`);
    
    // Wait a bit to see what happens
    await page.waitForLoadState('networkidle', { timeout: 5000 });
    
    const pageContent = await page.textContent('body');
    if (pageContent.includes('404') || pageContent.includes('not found') || pageContent.includes('error')) {
      console.log(`   Page shows error content`);
    } else {
      console.log(`   Page loaded - might be showing track info`);
      
      // Check for bass tab
      const tabCount = await page.locator('pre, .tab-display').count();
      console.log(`   Bass tab elements: ${tabCount}`);
    }

  } catch (error) {
    console.log(`   Missing track page error: ${error.message}`);
  }

  // Show console logs
  if (logs.length > 0) {
    console.log('\n5. FRONTEND CONSOLE LOGS:');
    logs.forEach(log => console.log(`   ${log}`));
  }

  console.log('\n=== DEBUGGING SUMMARY ===');
  console.log('Issues found:');
  console.log('- API endpoints may not match expected data');
  console.log('- Frontend may not be displaying all available tracks');
  console.log('- Green terminal styling appears to be missing');
  console.log('- 4th track (Rapper\'s Delight) may not be properly loaded in running instance');

  await browser.close();
}

comprehensiveDebug().catch(console.error);