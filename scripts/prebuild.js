'use strict';

/**
 * Prebuild entry point. Invoked automatically via npm's `prebuild` hook.
 *
 * - Runs `scripts/fetch-posts.js` to refresh Product Hunt data.
 * - If fetching fails, keeps the existing src/generated/posts.json so the
 *   build can continue using cached data.
 * - Skips entirely when SKIP_PREBUILD=true.
 */

if (process.env.SKIP_PREBUILD === 'true') {
  console.log('prebuild: skipped (SKIP_PREBUILD=true)');
  process.exit(0);
}

const { existsSync } = require('node:fs');
const { execSync } = require('node:child_process');

const generatedPath = 'src/generated/posts.json';
const hasExistingCache = existsSync(generatedPath);

const incrementalFlag = process.env.INCREMENTAL === 'true' ? ' --incremental' : '';

try {
  execSync(`node scripts/fetch-posts.js${incrementalFlag}`, { stdio: 'inherit' });
} catch (err) {
  if (hasExistingCache) {
    console.warn('prebuild: fetch failed, continuing with existing src/generated/posts.json');
    process.exit(0);
  }
  console.error('prebuild: fetch failed and no existing cache found');
  process.exit(1);
}
