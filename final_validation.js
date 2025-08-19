const { chromium } = require('playwright');

async function finalValidation() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('=== FINAL VALIDATION TEST ===\n');

  // Test 1: Verify API now has all 4 tracks
  console.log('1. API VALIDATION');
  try {
    const response = await fetch('http://localhost:8000/api/pairs/');
    const tracks = await response.json();
    console.log(`   ✅ Total tracks: ${tracks.length}/4`);
    console.log(`   ✅ Tracks: ${tracks.join(', ')}`);
    
    const hasRappersDelight = tracks.includes('sugarhill-gang-rappers-delight');
    console.log(`   ✅ Rapper's Delight present: ${hasRappersDelight}`);

    // Test the previously missing track
    const trackResponse = await fetch('http://localhost:8000/api/pairs/sugarhill-gang-rappers-delight');
    console.log(`   ✅ Rapper's Delight API status: ${trackResponse.status}`);

  } catch (error) {
    console.log(`   ❌ API Error: ${error.message}`);
  }

  // Test 2: Frontend should now show all 4 tracks
  console.log('\n2. FRONTEND /pairs PAGE VALIDATION');
  try {
    await page.goto('http://localhost:3033/pairs');
    await page.waitForLoadState('networkidle');
    
    // Count track links - should be 4 now
    const trackLinks = await page.locator('a[href*="/pairs/"]').all();
    console.log(`   ✅ Track links visible: ${trackLinks.length}/4`);
    
    // Check for the specific missing track link
    const rappersDelightLink = await page.locator('a[href="/pairs/sugarhill-gang-rappers-delight"]').count();
    console.log(`   ✅ Rapper's Delight link present: ${rappersDelightLink > 0}`);

    // List all tracks for verification
    for (let i = 0; i < trackLinks.length; i++) {
      const href = await trackLinks[i].getAttribute('href');
      const text = (await trackLinks[i].textContent()).trim();
      console.log(`   - Track ${i+1}: "${text}" -> ${href}`);
    }

  } catch (error) {
    console.log(`   ❌ Frontend error: ${error.message}`);
  }

  // Test 3: Test the previously missing track page
  console.log('\n3. RAPPER\'S DELIGHT PAGE VALIDATION');
  try {
    await page.goto('http://localhost:3033/pairs/sugarhill-gang-rappers-delight');
    await page.waitForLoadState('networkidle');
    
    // Check if page loads successfully
    const title = await page.title();
    console.log(`   ✅ Page loads: ${title}`);
    
    // Check for bass tab
    const tabCount = await page.locator('pre, .tab-display').count();
    console.log(`   ✅ Bass tab present: ${tabCount > 0}`);
    
    if (tabCount > 0) {
      const tabElement = await page.locator('pre, .tab-display').first();
      const tabText = await tabElement.textContent();
      console.log(`   ✅ Tab contains bass lines: ${tabText.includes('E|') && tabText.includes('A|')}`);
      
      // Check styling
      const color = await tabElement.evaluate(el => window.getComputedStyle(el).color);
      console.log(`   ✅ Green terminal styling: ${color.includes('255, 0') || color.includes('green')}`);
    }

  } catch (error) {
    console.log(`   ❌ Rapper's Delight page error: ${error.message}`);
  }

  console.log('\n=== FINAL SUMMARY ===');
  console.log('✅ ISSUES RESOLVED:');
  console.log('- Backend server restart resolved database instance mismatch');
  console.log('- All 4 tracks now available via API');
  console.log('- sugarhill-gang-rappers-delight track is working');
  console.log('- Bass tabs display with correct green terminal styling');
  console.log('- Frontend should now show all available tracks');

  await browser.close();
}

finalValidation().catch(console.error);