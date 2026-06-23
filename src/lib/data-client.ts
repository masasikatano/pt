import type { PostsData } from './types';

let cache: PostsData | null = null;

export async function fetchPostsData(): Promise<PostsData> {
  if (cache) return cache;
  const res = await fetch('/posts.json');
  if (!res.ok) {
    throw new Error(`Failed to fetch posts data: ${res.status}`);
  }
  const data = (await res.json()) as PostsData;
  cache = data;
  return data;
}
