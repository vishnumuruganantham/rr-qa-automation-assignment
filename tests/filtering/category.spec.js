const { test, expect } = require('@playwright/test');

const categories = ['Popular', 'Trend', 'Newest', 'Top rated'];

test.describe('Category filtering (UI)', () => {

    // TC-01: Category filter — active state (see docs/test-cases.md)
    for (const name of categories) {
        test(`clicking "${name}" activates the ${name} category`, async ({ page }) => {
            await page.goto('/');
            await page.getByRole('link', { name }).click();

            // Active tab is marked with `text-white` (inactive: `text-blue-500`).
            const Item = page.getByRole('link', { name }).locator('..');
            await expect(Item).toHaveClass(/text-white/);
        });
    }

});