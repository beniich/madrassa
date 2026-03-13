import { test, expect } from '@playwright/test';

test.describe('Madrassa Smoke Test', () => {
  test('should load the login page or home page', async ({ page }) => {
    // Note: We are assuming the app is running locally for this test
    // In a real CI, we would start the server first
    await page.goto('/');
    
    // Check for a common element like 'SchoolGenius' or a login button
    await expect(page).toHaveTitle(/SchoolGenius/i);
  });

  test('should have a working layout', async ({ page }) => {
    await page.goto('/');
    const mainContent = await page.locator('main, #root, body');
    await expect(mainContent).toBeVisible();
  });
});
