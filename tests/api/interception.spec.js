import { test, expect } from '@playwright/test';

test.describe('API interception', () => {

    // TC-10: Clicking a category triggers the correct TMDB call and returns data.
    test('Trend category requests trending data from TMDB', async ({ page }) => {
        await page.goto('/');

        // Wait specifically for the TRENDING response (the app fires several TMDB
        // calls — genres, listings — so we match the endpoint we care about).
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
    });

});