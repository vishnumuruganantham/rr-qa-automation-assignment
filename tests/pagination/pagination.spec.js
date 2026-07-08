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

test.describe('Pagination — known defect (UI)', () => {

    // TC-09: The last page should load results, but currently fails (known defect).
    test('last page should load results (known defect: it does not)', async ({ page }) => {

        // Marked test.fail(): we assert the CORRECT behavior (results load on the last
        // page). The known defect makes this assertion fail, so Playwright reports the
        // test as passing (expected failure). If the app is ever fixed, this test will
        // start genuinely passing — turning red under test.fail() — alerting us the
        // defect is resolved. See docs/defects.md 
        test.fail();

        await page.goto('/');

        // Navigate to the last page.
        // Click the last available page button (the exact number is volatile and
        // differs across environments, so select it dynamically).
        const pageButtons = page.getByRole('button', { name: /^Page \d+$/ });
        await pageButtons.last().click();

        // Expected correct behavior: the last page shows result cards.
        // (Currently fails — the app renders an error state instead.)
        await expect(page.locator('[class*="grid-cols-3"] > *').first())
            .toBeVisible({ timeout: 5000 });
    });

});