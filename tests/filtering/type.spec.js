import { test, expect } from '@playwright/test';
import { logger } from '../../src/utils/logger';

test.describe('Type filter (UI)', () => {

    // TC-03: Switching Type from Movie to TV Shows updates the selected value.
    test('selecting "TV Shows" updates the Type filter', async ({ page }) => {
        logger.info('Starting Type filter test');

        await page.goto('/');
        logger.info('Navigated to home page');

        // The Type control is the first react-select container (Genre is second).
        const typeControl = page.locator('//p[text()="Type"]/following-sibling::div[1]');
        await expect(typeControl).toContainText('Movie');
        logger.info('Verified Type defaults to "Movie"');

        await typeControl.click();
        await page.getByText('TV Shows', { exact: true }).click();
        logger.info('Selected "TV Shows" from the Type dropdown');

        await expect(typeControl).toContainText('TV Shows');
        logger.info('Verified Type now shows "TV Shows"');
    });

});