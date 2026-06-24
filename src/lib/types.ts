export interface Topic {
  id: string;
  name: string;
  slug: string;
}

export interface TopicSummary extends Topic {
  postCount: number;
}

export interface TopicGroup {
  slug: string;
  name: string;
  postCount: number;
}

export interface Maker {
  id: string;
  name: string;
  username: string | null;
  url: string;
}

export interface PostRecord {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  votesCount: number;
  commentsCount: number;
  featuredAt: string;
  createdAt: string;
  website: string;
  url: string;
  thumbnailUrl: string | null;
  topics: Topic[];
  makers: Maker[];
}

export interface PostsData {
  meta: {
    fetchedAt: string;
    postedAfter: string;
    totalCount: number;
    source: string;
  };
  groups: TopicGroup[];
  topicToGroup: Record<string, string>;
  posts: PostRecord[];
}

export type ViewMode = 'list' | 'ranking';
