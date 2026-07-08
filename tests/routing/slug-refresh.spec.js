import { test, expect } from '@playwright/test';
import { logger } from '../../src/utils/logger';

test.describe('Routing — slug access (known defect)', () => {

    // TC-13: Refreshing / directly loading a category slug fails (known defect).
    test('refreshing on a category slug shows "page not found"', async ({ page }) => {

        // The app is a client-side-routed SPA on a static host (surge.sh) with no SPA
        // fallback, so requesting a slug from the server returns surge's "page not
        // found" page and the app never loads. In-app navigation (clicking) works;
        // refresh and direct access do not. See docs/defects.md.
        logger.info('Navigating to home, then into the Trend category');
        await page.goto('/');
        await page.getByRole('link', { name: 'Trend' }).click();
        await expect(page).toHaveURL(/\/trend/);
        logger.info('On /trend via in-app navigation (works)');

        // Refresh the slug URL — the server (surge.sh) has no route for it.
        await page.reload();
        logger.info('Reloaded /trend');

        // The app does not load; surge.sh serves its "page not found" page.
        await expect(page.getByText(/page not found/i)).toBeVisible();
        logger.info('Verified "page not found" shown on refresh (known defect reproduced)');
    });

    test('direct access to a category slug shows "page not found"', async ({ page }) => {
        logger.info('Directly loading /trend (no in-app navigation)');

        // Load the slug directly, as if typing the URL / following a bookmark.
        await page.goto('/trend');

        await expect(page.getByText(/page not found/i)).toBeVisible();
        logger.info('Verified direct slug access shows "page not found" (known defect reproduced)');
    });

});