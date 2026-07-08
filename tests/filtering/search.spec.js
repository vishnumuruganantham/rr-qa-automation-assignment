import { test, expect } from '@playwright/test';
import { logger } from '../../src/utils/logger';

test.describe('Title search (UI)', () => {

    // TC-02: Searching a known title filters results to matching titles.
    test('searching a movie title returns matching results', async ({ page }) => {
        logger.info('Starting title search test');

        await page.goto('/');
        logger.info('Navigated to home page');

        const searchTerm = 'Batman';
        await page.getByPlaceholder('SEARCH').fill(searchTerm);
        logger.info(`Entered search term "${searchTerm}"`);

        // At least one result is visible...
        const results = page.getByText(searchTerm, { exact: false });
        await expect(results.first()).toBeVisible();

        // ...and every matched title actually contains the search term
        // (proves the grid filtered, not just that the word appears somewhere).
        const count = await results.count();
        expect(count).toBeGreaterThan(0);
        logger.info(`Found ${count} matching result(s)`);

        for (let i = 0; i < count; i++) {
            await expect(results.nth(i)).toContainText(/batman/i);
        }
        logger.info('Verified all results contain the search term');
    });

});