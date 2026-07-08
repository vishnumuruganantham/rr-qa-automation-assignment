// Lightweight logger for the test suite: timestamped, levelled messages.
// Writes to the console (visible in Playwright's list/console reporter) and
// returns the formatted line so callers can also attach it to the HTML report.

const LEVELS = { INFO: 'INFO', WARN: 'WARN', ERROR: 'ERROR', DEBUG: 'DEBUG' };

function format(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
}

function log(level, message) {
    const line = format(level, message);
    console.log(line);
    return line;
}

const logger = {
    info: (msg) => log(LEVELS.INFO, msg),
    warn: (msg) => log(LEVELS.WARN, msg),
    error: (msg) => log(LEVELS.ERROR, msg),
    debug: (msg) => log(LEVELS.DEBUG, msg),
};

module.exports = { logger };