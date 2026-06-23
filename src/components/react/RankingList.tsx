'use client';

import { t } from '@/lib/i18n';
import type { PostRecord } from '@/lib/types';

interface RankingListProps {
  posts: PostRecord[];
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('ja-JP');
  } catch {
    return iso;
  }
}

function formatNumber(num: number): string {
  return num.toLocaleString('ja-JP');
}

export default function RankingList({ posts }: RankingListProps) {
  if (posts.length === 0) {
    return <p className="empty-message">{t('empty.noPosts')}</p>;
  }

  return (
    <ol className="ranking-list">
      {posts.map((post, index) => (
        <li key={post.id} className="ranking-item">
          <span className="ranking-number">{index + 1}</span>
          <div className="ranking-body">
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ranking-name"
            >
              {post.name}
            </a>
            <p className="ranking-tagline">{post.tagline}</p>
            <div className="ranking-meta">
              <span>
                {formatNumber(post.votesCount)} {t('post.votes')}
              </span>
              <span>
                {formatDate(post.featuredAt)} {t('post.featuredAt')}
              </span>
              {post.topics.length > 0 && (
                <span className="ranking-topics">
                  {post.topics.map((topic) => topic.name).join(', ')}
                </span>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
