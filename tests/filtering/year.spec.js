import { test, expect } from '@playwright/test';
import { logger } from '../../src/utils/logger';

// Helper: pick a value in a react-select year dropdown.
// Types to filter the long year list, then clicks the menu OPTION (identified
// by its react-select option id), avoiding the identically-texted selected value.
async function selectYear(page, control, year) {
    await control.click();
    await control.locator('input').fill(year);
    await page.locator('[id^="react-select"][id*="option"]', { hasText: year }).click();
}

// The visible value of a react-select is rendered in a `singleValue` element.
// We anchor on the semantic `singleValue` class suffix (stable across builds),
// not the volatile emotion hash, and scope it within the given control.
function selectedValue(control) {
    return control.locator('xpath=.//div[contains(@class,"singleValue")]');
}

test.describe('Year filter (UI)', () => {

    // TC-05: Selecting from/to years updates the Year controls.
    test('selecting a year range updates the Year controls', async ({ page }) => {
        logger.info('Starting year range selection test');

        await page.goto('/');
        logger.info('Navigated to home page');

        // The two Year react-selects are the direct child divs of the wrapper
        // that follows the <p>Year</p> label.
        const yearWrapper = page.locator('//p[text()="Year"]/following-sibling::div[1]');
        const fromYear = yearWrapper.locator('> div').nth(0);
        const toYear = yearWrapper.locator('> div').nth(1);

        // Defaults: 1900 (from), 2025 (to).
        await expect(selectedValue(fromYear)).toHaveText('1900');
        await expect(selectedValue(toYear)).toHaveText('2025');
        logger.info('Verified default range 1900–2025');

        // Select a valid range.
        await selectYear(page, fromYear, '2000');
        await expect(selectedValue(fromYear)).toHaveText('2000');
        logger.info('Set "from" year to 2000');

        await selectYear(page, toYear, '2020');
        await expect(selectedValue(toYear)).toHaveText('2020');
        logger.info('Set "to" year to 2020; range now 2000–2020');
    });

});

test.describe('Year filter — inverted range prevention (UI)', () => {

    // TC-07: The "to" year cannot be set earlier than the "from" year.
    // react-select registers the selection internally, but the app reverts the
    // displayed value to keep the range valid — so the visible "to" year stays
    // >= "from". We assert on the visible singleValue only, because the control's
    // full text includes react-select's hidden ARIA announcements (which mention
    // the attempted "2019").
    test('selecting a "to" year earlier than "from" is not applied', async ({ page }) => {
        logger.info('Starting inverted year range prevention test');

        await page.goto('/');
        logger.info('Navigated to home page');

        const yearWrapper = page.locator('//p[text()="Year"]/following-sibling::div[1]');
        const fromYear = yearWrapper.locator('> div').nth(0);
        const toYear = yearWrapper.locator('> div').nth(1);

        // Move "from" up to 2020 (updates normally).
        await selectYear(page, fromYear, '2020');
        await expect(selectedValue(fromYear)).toHaveText('2020');
        logger.info('Set "from" year to 2020');

        // Attempt to set "to" to 2019 (earlier than from — invalid).
        await toYear.click();
        await toYear.locator('input').fill('2019');
        const option2019 = page.locator('[id^="react-select"][id*="option"]', { hasText: '2019' });
        if (await option2019.count() > 0) {
            await option2019.click();
        }
        logger.info('Attempted to set "to" year to 2019 (invalid: earlier than from)');

        // The displayed "to" value stays valid (2025), not the invalid 2019.
        await expect(selectedValue(toYear)).toHaveText('2025');
        logger.info('Verified invalid "to" value was not applied; still 2025');
    });

});