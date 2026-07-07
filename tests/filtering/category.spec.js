const { test, expect } = require('@playwright/test');

test.describe('Category filtering (UI)', () => {

    // TC-01: Category filter — active state (see docs/test-cases.md)
    test('clicking "Trend" makes it the active category', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('link', { name: 'Trend' }).click();

        // Active tab is marked with `text-white` (inactive: `text-blue-500`).
        const trendItem = page.getByRole('link', { name: 'Trend' }).locator('..');
        await expect(trendItem).toHaveClass(/text-white/);

    });

});