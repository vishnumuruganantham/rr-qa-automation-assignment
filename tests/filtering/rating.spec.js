import { test, expect } from '@playwright/test';

test.describe('Rating filter (UI)', () => {

    // TC-06: Selecting a star rating marks that rating as checked.
    test('selecting a star rating checks that rating', async ({ page }) => {
        await page.goto('/');

        // Ratings is an rc-rate radiogroup; stars are role="radio" divs
        // (not native inputs), with state tracked via aria-checked.
        const ratingGroup = page.getByRole('radiogroup');
        const stars = ratingGroup.getByRole('radio');

        // There are 5 stars.
        await expect(stars).toHaveCount(5);

        // Select the 3rd star.
        const thirdStar = stars.nth(2);
        await thirdStar.click();

        // Assert it is now checked
        await expect(thirdStar).toBeChecked();
    });

});