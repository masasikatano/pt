'use strict';

/**
 * Shared constants and helpers used by ProductTrapper fetch scripts.
 */

const PH_API_ENDPOINT = 'https://api.producthunt.com/v2/api/graphql';
const PH_POSTED_AFTER = '2026-01-01T00:00:00Z';
const PH_PAGE_SIZE = 25;
const PH_FETCH_SLEEP_MS = 800;
const PH_MAX_RETRIES = 3;

const PH_HEADERS = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'ProductTrapper/1.0 (https://pt.p12r.workers.dev/)',
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  PH_API_ENDPOINT,
  PH_POSTED_AFTER,
  PH_PAGE_SIZE,
  PH_FETCH_SLEEP_MS,
  PH_MAX_RETRIES,
  PH_HEADERS,
  sleep,
};
