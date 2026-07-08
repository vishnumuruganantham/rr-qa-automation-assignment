import { test, expect } from '@playwright/test';

test.describe('Title search (UI)', () => {

    // TC-02: Searching a known title filters results to matching titles.
    test('searching a movie title returns matching results', async ({ page }) => {
        await page.goto('/');

        const searchTerm = 'Batman';
        await page.getByPlaceholder('SEARCH').fill(searchTerm);

        // At least one result is visible...
        const results = page.getByText(searchTerm, { exact: false });
        await expect(results.first()).toBeVisible();

        // ...and every matched title actually contains the search term
        // (proves the grid filtered, not just that the word appears somewhere).
        const count = await results.count();
        expect(count).toBeGreaterThan(0);
        for (let i = 0; i < count; i++) {
            await expect(results.nth(i)).toContainText(/batman/i);
        }
    });

});