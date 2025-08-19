const { chromium } = require('playwright');

async function debugBassTabs() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('=== DEBUGGING BASS TAB WEBSITE ===\n');

  // Test 1: Test API endpoint directly
  console.log('1. Testing API endpoint: http://localhost:8000/api/pairs/');
  try {
    const response = await fetch('http://localhost:8000/api/pairs/');
    const data = await response.json();
    console.log('   ✅ API Response:', data);
    console.log('   📊 Number of tracks:', data.length);
  } catch (error) {
    console.log('   ❌ API Error:', error.message);
  }

  // Test 2: Test the missing track directly
  console.log('\n2. Testing missing track: sugarhill-gang-rappers-delight');
  try {
    const response = await fetch('http://localhost:8000/api/pairs/sugarhill-gang-rappers-delight');
    console.log('   📡 Status:', response.status);
    const data = await response.json();
    console.log('   📄 Response:', data);
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  // Test 3: Test a working track
  console.log('\n3. Testing working track: notorious-big-juicy');
  try {
    const response = await fetch('http://localhost:8000/api/pairs/notorious-big-juicy');
    console.log('   📡 Status:', response.status);
    const data = await response.json();
    console.log('   ✅ Track title:', data.track?.title);
    console.log('   ✅ Original title:', data.original?.title);
    console.log('   🎵 Has tab:', !!data.tab);
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  // Test 4: Navigate to frontend pairs page
  console.log('\n4. Testing frontend pairs page: http://localhost:3033/pairs');
  try {
    await page.goto('http://localhost:3033/pairs');
    await page.waitForLoadState('networkidle');
    
    // Check for any console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Check if the page loaded
    const title = await page.title();
    console.log('   📖 Page title:', title);
    
    // Look for track elements
    const tracks = await page.locator('[data-testid="track-item"], .track-item, a[href*="/pairs/"]').count();
    console.log('   🎵 Number of tracks visible:', tracks);

    // Get all track links
    const trackLinks = await page.locator('a[href*="/pairs/"]').all();
    for (let link of trackLinks) {
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      console.log(`   🔗 Found track link: ${text} -> ${href}`);
    }

    if (errors.length > 0) {
      console.log('   ❌ Console errors:', errors);
    }

  } catch (error) {
    console.log('   ❌ Frontend Error:', error.message);
  }

  // Test 5: Test a specific working track page
  console.log('\n5. Testing working track page: http://localhost:3033/pairs/notorious-big-juicy');
  try {
    await page.goto('http://localhost:3033/pairs/notorious-big-juicy');
    await page.waitForLoadState('networkidle');
    
    // Check for bass tabs
    const tabElements = await page.locator('pre, .tab-display, [data-testid="bass-tab"]').count();
    console.log('   🎼 Bass tab elements found:', tabElements);
    
    // Check for green terminal styling
    const hasGreenStyling = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      for (let el of elements) {
        const style = window.getComputedStyle(el);
        if (style.color.includes('green') || style.backgroundColor.includes('green')) {
          return true;
        }
      }
      return false;
    });
    console.log('   🟢 Has green terminal styling:', hasGreenStyling);

    // Check for video player
    const videoElements = await page.locator('iframe, video, [data-testid="video"]').count();
    console.log('   📺 Video elements found:', videoElements);

  } catch (error) {
    console.log('   ❌ Track page error:', error.message);
  }

  console.log('\n=== DEBUG SUMMARY ===');
  console.log('Expected: 4 tracks total');
  console.log('Missing: sugarhill-gang-rappers-delight');
  console.log('Working: notorious-big-juicy, dr-dre-nuthin-but-g-thang, public-enemy-fight-the-power');

  await browser.close();
}

debugBassTabs().catch(console.error);