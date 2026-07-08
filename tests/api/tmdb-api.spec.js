import { test, expect } from '@playwright/test';
import { logger } from '../../src/utils/logger';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const API_KEY = 'add494e96808c55b3ee7f940c9d5e5b6';

test.describe('TMDB API (direct)', () => {

    // TC-11: The trending endpoint returns valid, well-formed data.
    test('trending endpoint returns valid data', async ({ page }) => {
        logger.info('Starting direct API test: trending endpoint');

        await page.goto('/');
        logger.info('Established browser page context');

        // The request is issued via page.evaluate + in-page fetch (the browser's own
        // network context). The standalone `request` fixture is unreliable here: the
        // local network's SSL inspection resets most programmatic HTTPS connections
        // (~3 in 4 fail with ECONNRESET), whereas in-page fetch — using the browser's
        // trusted cert store — reaches TMDB consistently.
        logger.info('Requesting /trending/all/week via in-page fetch');
        const result = await page.evaluate(async ({ base, key }) => {
            const res = await fetch(`${base}/trending/all/week?api_key=${key}&page=1`);
            return {
                status: res.status,
                contentType: res.headers.get('content-type'),
                body: await res.json(),
            };
        }, { base: TMDB_BASE, key: API_KEY });

        expect(result.status).toBe(200);
        expect(result.contentType).toContain('application/json');
        logger.info(`Response: ${result.status}, content-type OK`);

        const body = result.body;
        expect(body).toHaveProperty('page', 1);
        expect(body).toHaveProperty('results');
        expect(Array.isArray(body.results)).toBe(true);
        expect(body.results.length).toBeGreaterThan(0);
        expect(body).toHaveProperty('total_pages');

        const first = body.results[0];
        expect(first).toHaveProperty('id');
        expect(first.title || first.name).toBeTruthy(); // title (movie) / name (tv) — DEF-12
        logger.info(`Validated response schema: ${body.results.length} results, ${body.total_pages} pages`);
    });

    // TC-12: The discover endpoint filtered by genre returns only that genre.
    test('discover with genre filter returns only that genre', async ({ page }) => {

        // Verifies genre filtering at the API level (with_genres uses TMDB genre IDs;
        // Adventure = 12). Also localizes DEF-07 (genre filter shows wrong results):
        // if the API returns only genre-12 movies, the defect is a UI rendering issue,
        // not an API one.
        logger.info('Starting direct API test: genre filter correctness');

        await page.goto('/');
        logger.info('Established browser page context');

        const ADVENTURE_ID = 12; // TMDB genre id for "Adventure"

        logger.info(`Requesting /discover/movie with_genres=${ADVENTURE_ID} (Adventure)`);
        const result = await page.evaluate(async ({ base, key, genre }) => {
            const url = `${base}/discover/movie?with_genres=${genre}&page=1&api_key=${key}`;
            const res = await fetch(url);
            return { status: res.status, body: await res.json() };
        }, { base: TMDB_BASE, key: API_KEY, genre: ADVENTURE_ID });

        expect(result.status).toBe(200);

        const results = result.body.results;
        expect(results.length).toBeGreaterThan(0);
        logger.info(`Received ${results.length} movies; verifying each includes genre ${ADVENTURE_ID}`);

        // Every returned movie must include the Adventure genre id.
        for (const movie of results) {
            expect(movie.genre_ids).toContain(ADVENTURE_ID);
        }
        logger.info('Verified all results include the Adventure genre');
    });

});