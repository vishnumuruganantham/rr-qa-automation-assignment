import { test, expect } from '@playwright/test';

test.describe('API interception', () => {

    // TC-10: Clicking a category triggers the correct TMDB call, returns valid
    // data, and the UI faithfully renders that data (UI-API contract).
    test('Trend category requests trending data and renders it', async ({ page }) => {
        await page.goto('/');

        // Wait specifically for the TRENDING response (the app fires several TMDB
        // calls on load — genres, listings — so match the endpoint we care about).
        const responsePromise = page.waitForResponse(resp =>
            resp.url().includes('/trending') && resp.status() === 200
        );

        await page.getByRole('link', { name: 'Trend' }).click();

        const response = await responsePromise;
        const body = await response.json();

        // Response has the expected shape and data.
        expect(body).toHaveProperty('results');
        expect(Array.isArray(body.results)).toBe(true);
        expect(body.results.length).toBeGreaterThan(0);

        // UI-API contract: the first result from the API is the first card in the UI.
        // TMDB uses `title` for movies and `name` for TV shows (see DEF-12).
        const firstApiTitle = body.results[0].title || body.results[0].name;
        await expect(page.locator('[class*="grid-cols-3"] p').first())
            .toHaveText(firstApiTitle);
    });

});