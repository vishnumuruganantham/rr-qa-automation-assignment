import { test, expect } from '@playwright/test';

test.describe('Type filter (UI)', () => {

    // TC-03: Switching Type from Movie to TV Shows updates the selected value.
    test('selecting "TV Shows" updates the Type filter', async ({ page }) => {
        await page.goto('/');

        // The Type control is the first react-select container (Genre is second).
        const typeControl = page.locator('//p[text()="Type"]/following-sibling::div[1]');
        await expect(typeControl).toContainText('Movie');
        await typeControl.click();
        await page.getByText('TV Shows', { exact: true }).click();
        await expect(typeControl).toContainText('TV Shows');
    });

});