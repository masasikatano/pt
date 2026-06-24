'use strict';

/**
 * Prebuild script: fetches featured Product Hunt posts from 2026-01-01
 * and writes normalized data to src/generated/posts.json.
 *
 * Usage: node scripts/fetch-posts.js
 */

require('dotenv').config({ path: '.env.local' });

const { mkdir, writeFile, copyFile, readFile, access } = require('node:fs/promises');
const {
  PH_API_ENDPOINT,
  PH_POSTED_AFTER,
  PH_PAGE_SIZE,
  PH_FETCH_SLEEP_MS,
  PH_MAX_RETRIES,
  PH_HEADERS,
  sleep,
} = require('./shared');

const FETCH_QUERY = `
  query FetchFeaturedPosts($postedAfter: DateTime!, $first: Int!, $after: String) {
    posts(
      featured: true
      postedAfter: $postedAfter
      order: FEATURED_AT
      first: $first
      after: $after
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          slug
          name
          tagline
          votesCount
          commentsCount
          featuredAt
          createdAt
          website
          url
          thumbnail {
            url(width: 200, height: 200)
          }
          topics(first: 5) {
            edges {
              node {
                id
                name
                slug
              }
            }
          }
          makers {
            id
            name
            username
            url
          }
        }
      }
    }
  }
`;

function normalizeTopic(edge) {
  const node = edge?.node;
  if (!node) return null;
  return {
    id: node.id,
    name: node.name,
    slug: node.slug,
  };
}

function normalizeMaker(maker) {
  if (!maker) return null;
  return {
    id: maker.id,
    name: maker.name,
    username: maker.username ?? null,
    url: maker.url,
  };
}

function normalizeThumbnailUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (/\.gif$/i.test(u.pathname)) {
      // `auto=format` can negotiate animated WebP/AVIF and override `fm=jpg`,
      // so remove it for GIFs to ensure a still JPEG frame is served.
      u.searchParams.delete('auto');
      u.searchParams.set('fm', 'jpg');
      return u.toString();
    }
    return url;
  } catch {
    return url;
  }
}

function normalizePost(node) {
  const topics = (node.topics?.edges ?? [])
    .map(normalizeTopic)
    .filter((t) => t != null);
  const makers = (node.makers ?? [])
    .map(normalizeMaker)
    .filter((m) => m != null);

  return {
    id: node.id,
    slug: node.slug,
    name: node.name,
    tagline: node.tagline,
    votesCount: node.votesCount ?? 0,
    commentsCount: node.commentsCount ?? 0,
    featuredAt: node.featuredAt,
    createdAt: node.createdAt,
    website: node.website,
    url: node.url,
    thumbnailUrl: normalizeThumbnailUrl(node.thumbnail?.url ?? null),
    topics,
    makers,
  };
}

async function fetchPage(token, after = null, postedAfter = PH_POSTED_AFTER, attempt = 1) {
  const variables = {
    postedAfter,
    first: PH_PAGE_SIZE,
    after,
  };

  const res = await fetch(PH_API_ENDPOINT, {
    method: 'POST',
    headers: PH_HEADERS(token),
    body: JSON.stringify({ query: FETCH_QUERY, variables }),
  });



  const json = await res.json();

  const isRateLimited =
    res.status === 429 || json.errors?.some((e) => e.error === 'rate_limit_reached');
  if (isRateLimited) {
    const resetIn = json.errors?.[0]?.details?.reset_in;
    const retryAfter = res.headers.get('Retry-After');
    const waitMs = resetIn
      ? (resetIn + 5) * 1000
      : retryAfter
        ? parseInt(retryAfter, 10) * 1000
        : Math.min(1000 * 2 ** attempt, 30000);
    if (attempt <= PH_MAX_RETRIES) {
      console.log(`[fetch-posts] Rate limited. Waiting ${waitMs}ms before retry ${attempt}/${PH_MAX_RETRIES}...`);
      await sleep(waitMs);
      return fetchPage(token, after, postedAfter, attempt + 1);
    }
  }

  if (!res.ok) {
    const text = JSON.stringify(json).slice(0, 200);
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  if (json.errors?.length) {
    const messages = json.errors.map((e) => e.message).join('; ');
    throw new Error(`GraphQL errors: ${messages}`);
  }

  return json.data.posts;
}

function buildTopicSummary(posts) {
  const counts = new Map();
  for (const post of posts) {
    for (const topic of post.topics) {
      const existing = counts.get(topic.slug);
      if (existing) {
        existing.postCount += 1;
      } else {
        counts.set(topic.slug, { ...topic, postCount: 1 });
      }
    }
  }
  return Array.from(counts.values()).sort((a, b) => b.postCount - a.postCount || a.name.localeCompare(b.name));
}

async function loadExistingPosts() {
  try {
    await access('src/generated/posts.json');
    const raw = await readFile('src/generated/posts.json', 'utf-8');
    const data = JSON.parse(raw);
    return Array.isArray(data.posts) ? data.posts : [];
  } catch {
    return [];
  }
}

function mergePosts(existing, fetched) {
  const map = new Map(existing.map((p) => [p.id, p]));
  for (const post of fetched) {
    map.set(post.id, post);
  }
  return Array.from(map.values());
}

async function savePosts(posts, isPartial = false) {
  posts.sort((a, b) => b.votesCount - a.votesCount || (a.featuredAt ?? '').localeCompare(b.featuredAt ?? ''));
  const topics = buildTopicSummary(posts);

  const output = {
    meta: {
      fetchedAt: new Date().toISOString(),
      postedAfter: PH_POSTED_AFTER,
      totalCount: posts.length,
      source: 'producthunt-api-v2',
    },
    topics,
    posts,
  };

  await mkdir('src/generated', { recursive: true });
  await mkdir('public', { recursive: true });
  await writeFile('src/generated/posts.json', JSON.stringify(output, null, 2));
  await copyFile('src/generated/posts.json', 'public/posts.json');

  if (isPartial) {
    console.warn(`[fetch-posts] Saved PARTIAL data: ${posts.length} posts and ${topics.length} topics (fetch was interrupted)`);
  } else {
    console.log(`[fetch-posts] Saved ${posts.length} posts and ${topics.length} topics to src/generated/posts.json`);
  }
}

async function main() {
  const token = process.env.PH_DEVELOPER_TOKEN;
  if (!token) {
    console.error('[fetch-posts] PH_DEVELOPER_TOKEN is not set');
    process.exit(1);
  }

  const incremental = process.argv.includes('--incremental');
  const existingPosts = incremental ? await loadExistingPosts() : [];

  let postedAfter = PH_POSTED_AFTER;
  if (incremental && existingPosts.length > 0) {
    const maxFeaturedAt = existingPosts
      .map((p) => p.featuredAt)
      .filter(Boolean)
      .sort()
      .pop();
    if (maxFeaturedAt) {
      postedAfter = maxFeaturedAt.replace(/\.\d{3}Z$/, 'Z');
    }
  }

  console.log(
    incremental
      ? `[fetch-posts] Incremental fetch for posts featured on or after ${postedAfter}...`
      : '[fetch-posts] Fetching featured posts from 2026-01-01...',
  );

  const fetched = [];
  let after = null;
  let page = 1;

  try {
    while (true) {
      const data = await fetchPage(token, after, postedAfter);
      const nodes = (data.edges ?? []).map((e) => e.node);
      fetched.push(...nodes.map(normalizePost));

      console.log(`[fetch-posts] Page ${page}: fetched ${nodes.length} posts (total ${fetched.length})`);

      // Save a checkpoint every 100 posts so we don't lose progress on long fetches.
      if (fetched.length > 0 && fetched.length % 100 === 0) {
        const merged = mergePosts(existingPosts, fetched);
        await savePosts(merged, true);
      }

      if (!data.pageInfo?.hasNextPage) break;
      after = data.pageInfo.endCursor;
      page += 1;
      await sleep(PH_FETCH_SLEEP_MS);
    }

    const merged = mergePosts(existingPosts, fetched);
    await savePosts(merged, false);
  } catch (err) {
    if (fetched.length > 0) {
      console.error('[fetch-posts] Error during fetch:', err.message);
      console.warn('[fetch-posts] Persisting already fetched posts so the build can continue.');
      const merged = mergePosts(existingPosts, fetched);
      await savePosts(merged, true);
      process.exit(0);
    }
    throw err;
  }
}

main().catch((err) => {
  console.error('[fetch-posts] Failed:', err.message);
  process.exit(1);
});
