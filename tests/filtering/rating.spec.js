import { test, expect } from '@playwright/test';
import { logger } from '../../src/utils/logger';

test.describe('Rating filter (UI)', () => {

    // TC-06: Selecting a star rating marks that rating as checked.
    test('selecting a star rating checks that rating', async ({ page }) => {
        logger.info('Starting rating filter test');

        await page.goto('/');
        logger.info('Navigated to home page');

        // Ratings is an rc-rate radiogroup; stars are role="radio" divs
        // (not native inputs), with state tracked via aria-checked.
        const ratingGroup = page.getByRole('radiogroup');
        const stars = ratingGroup.getByRole('radio');

        // There are 5 stars.
        await expect(stars).toHaveCount(5);
        logger.info('Verified rating group has 5 stars');

        // Select the 3rd star.
        const thirdStar = stars.nth(2);
        await thirdStar.click();
        logger.info('Clicked the 3rd star');

        // Assert it is now checked
        await expect(thirdStar).toBeChecked();
        logger.info('Verified the 3rd star is checked');
    });

});