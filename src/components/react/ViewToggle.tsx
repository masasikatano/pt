'use client';

import { t } from '@/lib/i18n';
import type { ViewMode } from '@/lib/types';

interface ViewToggleProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="view-toggle" role="group" aria-label="表示モード切替">
      <button
        type="button"
        className={`view-btn${view === 'list' ? ' active' : ''}`}
        onClick={() => onViewChange('list')}
        aria-pressed={view === 'list'}
      >
        {t('view.list')}
      </button>
      <button
        type="button"
        className={`view-btn${view === 'ranking' ? ' active' : ''}`}
        onClick={() => onViewChange('ranking')}
        aria-pressed={view === 'ranking'}
      >
        {t('view.ranking')}
      </button>
    </div>
  );
}
