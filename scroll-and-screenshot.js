const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8080/index.html');
  await page.waitForTimeout(2000);
  
  // Take full page screenshot
  await page.screenshot({ path: '/tmp/full-page.png', fullPage: true });
  
  console.log('Screenshot saved to /tmp/full-page.png');
  
  await browser.close();
})();
