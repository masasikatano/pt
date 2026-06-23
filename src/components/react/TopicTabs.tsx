'use client';

import { t } from '@/lib/i18n';
import type { TopicSummary } from '@/lib/types';

interface TopicTabsProps {
  topics: TopicSummary[];
  activeTopic: string | null;
  onTopicChange: (topicSlug: string | null) => void;
}

export default function TopicTabs({ topics, activeTopic, onTopicChange }: TopicTabsProps) {
  return (
    <nav className="topic-tabs" role="tablist" aria-label="トピックフィルター">
      <button
        type="button"
        role="tab"
        className={`topic-tab${activeTopic === null ? ' active' : ''}`}
        onClick={() => onTopicChange(null)}
        aria-selected={activeTopic === null}
      >
        {t('topic.all')}
      </button>
      {topics.map((topic) => (
        <button
          key={topic.slug}
          type="button"
          role="tab"
          className={`topic-tab${activeTopic === topic.slug ? ' active' : ''}`}
          onClick={() => onTopicChange(topic.slug)}
          aria-selected={activeTopic === topic.slug}
        >
          {topic.name}
          <span className="topic-count">{topic.postCount}</span>
        </button>
      ))}
    </nav>
  );
}
