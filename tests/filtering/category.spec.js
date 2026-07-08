const { test, expect } = require('@playwright/test');
const { logger } = require('../../src/utils/logger');

const categories = ['Popular', 'Trend', 'Newest', 'Top rated'];

test.describe('Category filtering (UI)', () => {

    // TC-01: Category filter — active state (see docs/test-cases.md)
    for (const name of categories) {
        test(`clicking "${name}" activates the ${name} category`, async ({ page }) => {
            logger.info(`Starting category test for "${name}"`);

            await page.goto('/');
            logger.info('Navigated to home page');

            await page.getByRole('link', { name }).click();
            logger.info(`Clicked "${name}" category`);

            // Active tab is marked with `text-white` (inactive: `text-blue-500`).
            const Item = page.getByRole('link', { name }).locator('..');
            await expect(Item).toHaveClass(/text-white/);
            logger.info(`Verified "${name}" is the active category`);
        });
    }

});