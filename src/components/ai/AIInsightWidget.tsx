// ============================================================
// AIInsightWidget.tsx — Widget insights dashboard
// ============================================================
import React, { useEffect, useState } from 'react';
import { getInsights, generateInsights, markInsightsRead, type AIInsight } from '../../services/ollamaService';

const INSIGHT_COLORS = {
  alert: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b', icon: '🚨' },
  warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e', icon: '⚠️' },
  summary: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', icon: '📊' },
  info: { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', icon: 'ℹ️' },
};

export const AIInsightWidget: React.FC = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const data = await getInsights();
      setInsights(data);
    } catch {
      // Silencieux si hors ligne
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generateInsights();
      await loadInsights();
    } finally {
      setGenerating(false);
    }
  };

  const handleMarkRead = async () => {
    await markInsightsRead();
    setInsights((prev) => prev.map((i) => ({ ...i, is_read: true })));
  };

  const unreadCount = insights.filter((i) => !i.is_read).length;

  return (
    <div className="insight-widget">
      <div className="insight-widget__header">
        <div className="insight-widget__title">
          <span>🤖</span>
          <span>Insights IA</span>
          {unreadCount > 0 && (
            <span className="insight-widget__badge">{unreadCount}</span>
          )}
        </div>
        <div className="insight-widget__actions">
          {unreadCount > 0 && (
            <button className="insight-btn insight-btn--ghost" onClick={handleMarkRead}>
              ✓ Tout marquer lu
            </button>
          )}
          <button
            className="insight-btn insight-btn--primary"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? '⏳' : '✨'} Actualiser
          </button>
        </div>
      </div>

      <div className="insight-widget__body">
        {loading && (
          <div className="insight-empty">
            <div className="insight-spinner" />
            <span>Loading...s insights...</span>
          </div>
        )}

        {!loading && insights.length === 0 && (
          <div className="insight-empty">
            <span style={{ fontSize: 32 }}>🔍</span>
            <p>Aucun insight disponible.</p>
            <button className="insight-btn insight-btn--primary" onClick={handleGenerate}>
              Générer les premiers insights
            </button>
          </div>
        )}

        {insights.map((insight) => {
          const style = INSIGHT_COLORS[insight.type] || INSIGHT_COLORS.info;
          return (
            <div
              key={insight.id}
              className={`insight-card ${!insight.is_read ? 'insight-card--unread' : ''}`}
              style={{ background: style.bg, borderColor: style.border }}
            >
              <div className="insight-card__icon">{style.icon}</div>
              <div className="insight-card__content">
                <div className="insight-card__title" style={{ color: style.text }}>
                  {insight.title}
                </div>
                <div className="insight-card__body">{insight.content}</div>
                <div className="insight-card__meta">
                  <span>{insight.agent} •</span>
                  <span>{new Date(insight.created_at).toLocaleString('fr-FR')}</span>
                </div>
              </div>
              {!insight.is_read && <div className="insight-card__unread-dot" />}
            </div>
          );
        })}
      </div>

      <style>{`
        .insight-widget {
          background: white;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          font-family: system-ui, sans-serif;
        }
        .insight-widget__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #f3f4f6;
          background: #fafafa;
        }
        .insight-widget__title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 15px;
          color: #111827;
        }
        .insight-widget__badge {
          background: #ef4444;
          color: white;
          font-size: 11px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 99px;
          min-width: 18px;
          text-align: center;
        }
        .insight-widget__actions { display: flex; gap: 8px; }
        .insight-btn {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.15s;
        }
        .insight-btn--primary { background: #3b82f6; color: white; }
        .insight-btn--primary:hover:not(:disabled) { background: #1d4ed8; }
        .insight-btn--primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .insight-btn--ghost {
          background: transparent;
          color: #6b7280;
          border: 1px solid #e5e7eb;
        }
        .insight-btn--ghost:hover { background: #f9fafb; }
        .insight-widget__body {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 400px;
          overflow-y: auto;
        }
        .insight-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 32px;
          color: #9ca3af;
          font-size: 14px;
          text-align: center;
        }
        .insight-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid #e5e7eb;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .insight-card {
          display: flex;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1.5px solid;
          position: relative;
          transition: all 0.15s;
        }
        .insight-card--unread { box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .insight-card__icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
        .insight-card__content { flex: 1; min-width: 0; }
        .insight-card__title { font-weight: 600; font-size: 13px; margin-bottom: 4px; }
        .insight-card__body { font-size: 12px; color: #374151; white-space: pre-wrap; line-height: 1.5; }
        .insight-card__meta {
          display: flex;
          gap: 4px;
          font-size: 11px;
          color: #9ca3af;
          margin-top: 6px;
        }
        .insight-card__unread-dot {
          width: 8px;
          height: 8px;
          background: #3b82f6;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
};

export default AIInsightWidget;
