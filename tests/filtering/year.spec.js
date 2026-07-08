import { test, expect } from '@playwright/test';

test.describe('Year filter (UI)', () => {

    // TC-05: Selecting from/to years updates the Year controls.
    test('selecting a year range updates the Year controls', async ({ page }) => {
        await page.goto('/');

        // The two Year react-selects are the direct child divs of the wrapper
        // that follows the <p>Year</p> label.
        const yearWrapper = page.locator('//p[text()="Year"]/following-sibling::div[1]');
        const fromYear = yearWrapper.locator('> div').nth(0);
        const toYear = yearWrapper.locator('> div').nth(1);

        // Defaults: 1900 (from), 2025 (to).
        await expect(fromYear).toContainText('1900');
        await expect(toYear).toContainText('2025');

        // Change the "from" year.
        await fromYear.click();
        await page.getByText('2000', { exact: true }).click();
        await expect(fromYear).toContainText('2000');

        // Change the "to" year.
        await toYear.click();
        await page.getByText('2020', { exact: true }).click();
        await expect(toYear).toContainText('2020');
    });

});