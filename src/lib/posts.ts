import type { PostRecord, PostsData, TopicGroup, ViewMode } from './types';

const modules = import.meta.glob('../generated/posts.json', { eager: true });
const postsData = (modules['../generated/posts.json'] as { default?: PostsData } | undefined)?.default ?? {
  meta: {
    fetchedAt: new Date().toISOString(),
    postedAfter: '2026-01-01T00:00:00Z',
    totalCount: 0,
    source: 'producthunt-api-v2',
  },
  groups: [],
  topicToGroup: {},
  posts: [],
};

export function loadPosts(): PostRecord[] {
  return postsData.posts ?? [];
}

export function loadGroups(): TopicGroup[] {
  return postsData.groups ?? [];
}

export function loadTopicToGroup(): PostsData['topicToGroup'] {
  return postsData.topicToGroup ?? {};
}

export function loadMeta(): PostsData['meta'] {
  return postsData.meta;
}

export function filterPostsByGroup(
  posts: PostRecord[],
  groupSlug: string | null,
  topicToGroup: Record<string, string>,
): PostRecord[] {
  if (!groupSlug) return posts;
  return posts.filter((post) =>
    post.topics.some((topic) => (topicToGroup[topic.slug] ?? 'other') === groupSlug),
  );
}

export function sortPostsByVotes(posts: PostRecord[]): PostRecord[] {
  return [...posts].sort((a, b) => b.votesCount - a.votesCount);
}

export function isViewMode(value: string | null): value is ViewMode {
  return value === 'list' || value === 'ranking';
}
