import { test, expect } from '@playwright/test';
import { logger } from '../../src/utils/logger';

const movieGenres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery',
    'Romance', 'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western',
];

const tvGenres = [
    'Action & Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Family', 'Kids', 'Mystery', 'News', 'Reality',
    'Sci-Fi & Fantasy', 'Soap', 'Talk', 'War & Politics', 'Western',
];

test.describe('Genre filter (UI)', () => {

    // Helper: open the Genre dropdown and return all option labels.
    async function readGenreOptions(page) {
        await page.getByText('Select...').click();
        const options = page.locator('[id^="react-select"][id*="option"]');
        await expect(options.first()).toBeVisible();
        const texts = await options.allTextContents();
        return texts.map(t => t.trim()).filter(Boolean);
    }

    // TC-04: Genre list matches the selected content type.
    test('Movie type shows the correct genre set', async ({ page }) => {
        logger.info('Starting genre set test for Type = Movie');

        await page.goto('/');            // starts on Movie by default
        logger.info('Navigated to home page (Type defaults to Movie)');

        const options = await readGenreOptions(page);
        logger.info(`Read ${options.length} genre options for Movie`);

        expect(options.sort()).toEqual([...movieGenres].sort());
        expect(options).not.toContain('Soap');
        logger.info('Verified Movie genre set matches expected (Soap absent)');
    });

    test('TV Shows type shows the correct genre set', async ({ page }) => {
        logger.info('Starting genre set test for Type = TV Shows');

        await page.goto('/');
        logger.info('Navigated to home page');

        // Switch Type to TV Shows first.
        const typeControl = page.locator('//p[text()="Type"]/following-sibling::div[1]');
        await typeControl.click();
        await page.getByText('TV Shows', { exact: true }).click();
        logger.info('Switched Type to TV Shows');

        const options = await readGenreOptions(page);
        logger.info(`Read ${options.length} genre options for TV Shows`);

        expect(options.sort()).toEqual([...tvGenres].sort());
        expect(options).toContain('Soap');
        logger.info('Verified TV Shows genre set matches expected (Soap present)');
    });

});