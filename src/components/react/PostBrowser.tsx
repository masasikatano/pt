'use client';

import { useState, useMemo, useEffect } from 'react';
import type { PostRecord, TopicSummary, ViewMode } from '@/lib/types';
import { fetchPostsData } from '@/lib/data-client';
import ViewToggle from './ViewToggle';
import TopicTabs from './TopicTabs';
import PostGrid from './PostGrid';
import RankingList from './RankingList';

interface PostBrowserProps {
  initialView: ViewMode;
  initialTopic: string | null;
}

function updateQueryString(view: ViewMode, topic: string | null) {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  if (view === 'list') {
    params.delete('view');
  } else {
    params.set('view', view);
  }
  if (topic) {
    params.set('topic', topic);
  } else {
    params.delete('topic');
  }
  const query = params.toString();
  const url = query ? `?${query}` : window.location.pathname;
  window.history.replaceState({}, '', url);
}

export default function PostBrowser({ initialView, initialTopic }: PostBrowserProps) {
  const [view, setView] = useState<ViewMode>(initialView);
  const [topic, setTopic] = useState<string | null>(initialTopic);
  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [topics, setTopics] = useState<TopicSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPostsData()
      .then((data) => {
        if (cancelled) return;
        setPosts(data.posts);
        setTopics(data.topics);
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
    updateQueryString(view, topic);
  }, [view, topic]);

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (topic) {
      result = result.filter((post) => post.topics.some((t) => t.slug === topic));
    }
    result = [...result].sort((a, b) => b.votesCount - a.votesCount);
    return result;
  }, [posts, topic]);

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
        <TopicTabs topics={topics} activeTopic={topic} onTopicChange={setTopic} />
      </div>
      {view === 'list' ? (
        <PostGrid posts={filteredPosts} />
      ) : (
        <RankingList posts={filteredPosts} />
      )}
    </div>
  );
}
