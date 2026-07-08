import { test, expect } from '@playwright/test';

test.describe('Pagination (UI)', () => {

    // TC-08: Navigating to page 2 changes the active page AND loads new content.
    test('clicking page 2 activates page 2 and changes results', async ({ page }) => {
        await page.goto('/');

        const pager = page.locator('#react-paginate');

        // Page 1 is active initially.
        await expect(pager.locator('li.selected')).toContainText('1');

        // Capture an identifier of the first result on page 1.
        // (Adjust the card selector to your grid — see note below.)
        const firstCard = page.locator('[class*="grid-cols-3"] > *').first();// TBD selector
        const page1FirstText = await firstCard.innerText();

        // Go to page 2.
        await page.getByRole('button', { name: 'Page 2', exact: true }).click();

        // Pager state updated to page 2.
        await expect(pager.locator('li.selected')).toContainText('2');
        await expect(page.getByRole('button', { name: /Page 2 is your current page/ }))
            .toHaveAttribute('aria-current', 'page');

        // Content changed: the first result differs from page 1.
        await expect(firstCard).not.toHaveText(page1FirstText);

    });

});