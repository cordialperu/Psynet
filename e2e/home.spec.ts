import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Psynet/i);
  });

  test('should display therapies', async ({ page }) => {
    await page.goto('/');
    
    // Wait for therapies to load
    await page.waitForSelector('[data-testid="therapy-card"]', { timeout: 10000 });
    
    const therapyCards = await page.locator('[data-testid="therapy-card"]').count();
    expect(therapyCards).toBeGreaterThan(0);
  });

  test('should filter by category', async ({ page }) => {
    await page.goto('/');
    
    // Click on a category filter
    await page.click('text=Terapias');
    
    // Wait for filtered results
    await page.waitForTimeout(1000);
    
    // Verify URL or filtered content
    const url = page.url();
    expect(url).toContain('terapias');
  });

  test('should navigate to therapy detail', async ({ page }) => {
    await page.goto('/');
    
    // Wait for therapies to load
    await page.waitForSelector('[data-testid="therapy-card"]');
    
    // Click on first therapy
    await page.click('[data-testid="therapy-card"]');
    
    // Verify navigation to detail page
    await expect(page).toHaveURL(/\/therapy\/.+/);
  });
});
