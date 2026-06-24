'use client';

import { t } from '@/lib/i18n';
import type { PostRecord } from '@/lib/types';

interface PostGridProps {
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

export default function PostGrid({ posts }: PostGridProps) {
  if (posts.length === 0) {
    return <p className="empty-message">{t('empty.noPosts')}</p>;
  }

  return (
    <ul className="post-grid">
      {posts.map((post) => (
        <li key={post.id} className="post-card">
          <div className="post-thumbnail">
            {post.thumbnailUrl ? (
              <img src={post.thumbnailUrl} alt={post.name} loading="lazy" />
            ) : (
              <div className="post-thumbnail-placeholder">{t('post.noThumbnail')}</div>
            )}
          </div>
          <div className="post-content">
            <h2 className="post-name">{post.name}</h2>
            <p className="post-tagline">{post.tagline}</p>
            <div className="post-stats">
              <span className="post-stat">
                {formatNumber(post.votesCount)} {t('post.votes')}
              </span>
              <span className="post-stat">
                {formatNumber(post.commentsCount)} {t('post.comments')}
              </span>
              <span className="post-stat">
                {formatDate(post.featuredAt)} {t('post.featuredAt')}
              </span>
            </div>
            {post.topics.length > 0 && (
              <ul className="post-topics">
                {post.topics.map((topic) => (
                  <li key={topic.slug} className="post-topic">
                    {topic.name}
                  </li>
                ))}
              </ul>
            )}
            <div className="post-links">
              <a
                href={post.website}
                target="_blank"
                rel="noopener noreferrer"
                className="post-link"
              >
                {t('post.website')}
              </a>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="post-link"
              >
                {t('post.productHunt')}
              </a>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
