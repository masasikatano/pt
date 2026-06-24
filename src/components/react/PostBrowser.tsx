'use client';

import { useState, useMemo, useEffect } from 'react';
import type { PostRecord, TopicGroup, ViewMode } from '@/lib/types';
import { fetchPostsData } from '@/lib/data-client';
import { filterPostsByGroup } from '@/lib/posts';
import ViewToggle from './ViewToggle';
import TopicTabs from './TopicTabs';
import PostGrid from './PostGrid';
import RankingList from './RankingList';

interface PostBrowserProps {
  initialView: ViewMode;
  initialGroup: string | null;
}

function updateQueryString(view: ViewMode, group: string | null) {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  if (view === 'list') {
    params.delete('view');
  } else {
    params.set('view', view);
  }
  if (group) {
    params.set('group', group);
  } else {
    params.delete('group');
  }
  // Remove legacy topic param once the user interacts with the new filter.
  params.delete('topic');
  const query = params.toString();
  const url = query ? `?${query}` : window.location.pathname;
  window.history.replaceState({}, '', url);
}

export default function PostBrowser({ initialView, initialGroup }: PostBrowserProps) {
  const [view, setView] = useState<ViewMode>(initialView);
  const [group, setGroup] = useState<string | null>(initialGroup);
  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [groups, setGroups] = useState<TopicGroup[]>([]);
  const [topicToGroup, setTopicToGroup] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPostsData()
      .then((data) => {
        if (cancelled) return;
        setPosts(data.posts);
        setGroups(data.groups);
        setTopicToGroup(data.topicToGroup);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    updateQueryString(view, group);
  }, [view, group]);

  const filteredPosts = useMemo(() => {
    return filterPostsByGroup(posts, group, topicToGroup).sort(
      (a, b) => b.votesCount - a.votesCount,
    );
  }, [posts, group, topicToGroup]);

  if (loading) {
    return <p className="loading-message">読み込み中...</p>;
  }

  if (error) {
    return <p className="error-message">データの読み込みに失敗しました: {error}</p>;
  }

  return (
    <div className="post-browser">
      <div className="controls">
        <ViewToggle view={view} onViewChange={setView} />
        <TopicTabs groups={groups} activeGroup={group} onGroupChange={setGroup} />
      </div>
      {view === 'list' ? (
        <PostGrid posts={filteredPosts} />
      ) : (
        <RankingList posts={filteredPosts} />
      )}
    </div>
  );
}
