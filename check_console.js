import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  console.log('Navigating to http://localhost:3006');
  await page.goto('http://localhost:3006');
  
  // Wait a bit to catch any deferred errors
  await new Promise(resolve => setTimeout(resolve, 2000));

  await browser.close();
})();
