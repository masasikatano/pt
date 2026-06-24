'use client';

import { t } from '@/lib/i18n';
import type { TopicGroup } from '@/lib/types';

interface TopicTabsProps {
  groups: TopicGroup[];
  activeGroup: string | null;
  onGroupChange: (groupSlug: string | null) => void;
}

export default function TopicTabs({ groups, activeGroup, onGroupChange }: TopicTabsProps) {
  return (
    <nav className="topic-tabs" role="tablist" aria-label="トピックグループフィルター">
      <button
        type="button"
        role="tab"
        className={`topic-tab${activeGroup === null ? ' active' : ''}`}
        onClick={() => onGroupChange(null)}
        aria-selected={activeGroup === null}
      >
        {t('topic.all')}
      </button>
      {groups.map((group) => (
        <button
          key={group.slug}
          type="button"
          role="tab"
          className={`topic-tab${activeGroup === group.slug ? ' active' : ''}`}
          onClick={() => onGroupChange(group.slug)}
          aria-selected={activeGroup === group.slug}
        >
          {group.name}
          <span className="topic-count">{group.postCount}</span>
        </button>
      ))}
    </nav>
  );
}
