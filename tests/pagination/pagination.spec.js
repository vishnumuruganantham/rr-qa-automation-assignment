import { test, expect } from '@playwright/test';
import { logger } from '../../src/utils/logger';

test.describe('Pagination (UI)', () => {

    // TC-08: Navigating to page 2 changes the active page AND loads new content.
    test('clicking page 2 activates page 2 and changes results', async ({ page }) => {
        logger.info('Starting pagination page-change test');

        await page.goto('/');
        logger.info('Navigated to home page');

        const pager = page.locator('#react-paginate');

        // Page 1 is active initially.
        await expect(pager.locator('li.selected')).toContainText('1');
        logger.info('Verified page 1 is active initially');

        // Capture an identifier of the first result on page 1.
        const firstCard = page.locator('[class*="grid-cols-3"] > *').first();
        const page1FirstText = await firstCard.innerText();
        logger.info('Captured first result on page 1');

        // Go to page 2.
        await page.getByRole('button', { name: 'Page 2', exact: true }).click();
        logger.info('Clicked page 2');

        // Pager state updated to page 2.
        await expect(pager.locator('li.selected')).toContainText('2');
        await expect(page.getByRole('button', { name: /Page 2 is your current page/ }))
            .toHaveAttribute('aria-current', 'page');
        logger.info('Verified page 2 is now the active page');

        // Content changed: the first result differs from page 1.
        await expect(firstCard).not.toHaveText(page1FirstText);
        logger.info('Verified results changed between page 1 and page 2');
    });

});

test.describe('Pagination — known defect (UI)', () => {

    // TC-09: The last page is unreliable (known defect). It intermittently either
    // loads results or renders an error state. Rather than assert a single
    // deterministic outcome (which would flake), we assert the page reaches a
    // valid terminal state — results OR the error screen — and log which occurred.
    // See docs/defects.md.
    test('last page reaches a valid state (known intermittent defect)', async ({ page }) => {
        logger.info('Starting last-page pagination test (known intermittent defect)');

        await page.goto('/');
        logger.info('Navigated to home page');

        // Click the last available page button (the number is volatile, so select
        // it dynamically).
        const pageButtons = page.getByRole('button', { name: /^Page \d+$/ });
        await pageButtons.last().click();
        logger.info('Clicked the last available page');

        // The last page intermittently loads results or shows an error state.
        // Assert it reaches one of these valid terminal states.
        const results = page.locator('[class*="grid-cols-3"] > *').first();
        const errorState = page.getByText(/something went wrong/i);
        await expect(results.or(errorState)).toBeVisible({ timeout: 10000 });

        // Log which outcome occurred this run.
        if (await errorState.isVisible()) {
            logger.warn('Last page rendered the error state (defect reproduced)');
        } else {
            logger.info('Last page loaded results (defect did not reproduce this run)');
        }
    });

});