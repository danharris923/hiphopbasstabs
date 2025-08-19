const { chromium } = require('playwright');

async function testVercelDeployment() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('=== VERCEL DEPLOYMENT TEST ===\n');

  try {
    // Test 1: Navigate to the site
    console.log('1. TESTING MAIN SITE ACCESS');
    console.log('   URL: https://hiphopbasstabs.vercel.app/');
    
    const response = await page.goto('https://hiphopbasstabs.vercel.app/', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log(`   Response status: ${response.status()}`);
    console.log(`   Response headers: ${JSON.stringify(await response.allHeaders(), null, 2)}`);
    
    if (response.status() === 404) {
      console.log('   ❌ 404 ERROR DETECTED');
      
      // Check if it's a Vercel 404 page
      const title = await page.title();
      console.log(`   Page title: "${title}"`);
      
      const bodyText = await page.textContent('body');
      console.log(`   Page content preview: "${bodyText.substring(0, 200)}..."`);
      
      // Check for Vercel-specific 404 indicators
      const isVercel404 = bodyText.includes('This page could not be found') || 
                          bodyText.includes('404') || 
                          title.includes('404');
      
      console.log(`   Is Vercel 404 page: ${isVercel404}`);
      
      // Check if there are any build files
      try {
        const nextResponse = await page.goto('https://hiphopbasstabs.vercel.app/_next/static/', { 
          waitUntil: 'networkidle',
          timeout: 10000 
        });
        console.log(`   _next/static status: ${nextResponse.status()}`);
      } catch (e) {
        console.log(`   _next/static access failed: ${e.message}`);
      }
      
    } else {
      console.log('   ✅ Site loaded successfully');
      
      // Test actual functionality
      const title = await page.title();
      console.log(`   Page title: "${title}"`);
      
      // Check for key elements
      const hasNavigation = await page.locator('nav').count() > 0;
      const hasContent = await page.locator('main, article, .container').count() > 0;
      
      console.log(`   Has navigation: ${hasNavigation}`);
      console.log(`   Has main content: ${hasContent}`);
    }

  } catch (error) {
    console.log(`   ❌ Navigation error: ${error.message}`);
  }

  // Test 2: Check if it's a backend API issue
  console.log('\n2. TESTING API CONNECTIVITY');
  try {
    // The frontend might be trying to connect to localhost:8000
    const apiResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/pairs/');
        return { status: response.status, ok: response.ok };
      } catch (e) {
        return { error: e.message };
      }
    });
    
    console.log(`   API test result: ${JSON.stringify(apiResponse)}`);
    
    // Check if the frontend has hardcoded localhost URLs
    const networkRequests = [];
    page.on('request', request => {
      if (request.url().includes('localhost') || request.url().includes('127.0.0.1')) {
        networkRequests.push(request.url());
      }
    });
    
    await page.reload({ waitUntil: 'networkidle' });
    
    if (networkRequests.length > 0) {
      console.log('   ❌ Localhost requests detected:');
      networkRequests.forEach(url => console.log(`     - ${url}`));
    } else {
      console.log('   ✅ No localhost requests detected');
    }
    
  } catch (error) {
    console.log(`   API test error: ${error.message}`);
  }

  // Test 3: Check console errors
  console.log('\n3. CHECKING BROWSER CONSOLE');
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push(`${msg.type()}: ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    consoleMessages.push(`error: ${error.message}`);
  });
  
  await page.reload({ waitUntil: 'networkidle' });
  
  if (consoleMessages.length > 0) {
    console.log('   Console messages:');
    consoleMessages.forEach(msg => console.log(`     ${msg}`));
  } else {
    console.log('   ✅ No console errors');
  }

  // Test 4: Check Vercel deployment configuration
  console.log('\n4. VERCEL DEPLOYMENT ANALYSIS');
  
  // Check for common Vercel deployment issues
  try {
    const manifestResponse = await page.goto('https://hiphopbasstabs.vercel.app/manifest.json', { 
      timeout: 10000 
    });
    console.log(`   Manifest status: ${manifestResponse.status()}`);
  } catch (e) {
    console.log(`   No manifest found (normal for Next.js): ${e.message}`);
  }
  
  // Check robots.txt
  try {
    const robotsResponse = await page.goto('https://hiphopbasstabs.vercel.app/robots.txt', { 
      timeout: 10000 
    });
    console.log(`   Robots.txt status: ${robotsResponse.status()}`);
  } catch (e) {
    console.log(`   Robots.txt check failed: ${e.message}`);
  }

  console.log('\n=== DIAGNOSIS SUMMARY ===');
  console.log('Based on the test results above:');
  console.log('1. If getting 404: Likely build/deployment configuration issue');
  console.log('2. If localhost requests: Frontend hardcoded to local backend');
  console.log('3. If console errors: Check JavaScript/React issues');
  console.log('4. Check vercel.json configuration and build settings');

  await browser.close();
}

testVercelDeployment().catch(console.error);