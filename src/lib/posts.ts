import type { PostRecord, PostsData, TopicSummary, ViewMode } from './types';

const modules = import.meta.glob('../generated/posts.json', { eager: true });
const postsData = (modules['../generated/posts.json'] as { default?: PostsData } | undefined)?.default ?? {
  meta: {
    fetchedAt: new Date().toISOString(),
    postedAfter: '2026-01-01T00:00:00Z',
    totalCount: 0,
    source: 'producthunt-api-v2',
  },
  topics: [],
  posts: [],
};

export function loadPosts(): PostRecord[] {
  return postsData.posts ?? [];
}

export function loadTopics(): TopicSummary[] {
  return postsData.topics ?? [];
}

export function loadMeta(): PostsData['meta'] {
  return postsData.meta;
}

export function filterPostsByTopic(posts: PostRecord[], topicSlug: string | null): PostRecord[] {
  if (!topicSlug) return posts;
  return posts.filter((post) => post.topics.some((topic) => topic.slug === topicSlug));
}

export function sortPostsByVotes(posts: PostRecord[]): PostRecord[] {
  return [...posts].sort((a, b) => b.votesCount - a.votesCount);
}

export function isViewMode(value: string | null): value is ViewMode {
  return value === 'list' || value === 'ranking';
}
