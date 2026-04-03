// ============================================================
// AIAgentCard.tsx — Card agent avec statut et sélection
// ============================================================
import React from 'react';
import type { AgentInfo, AgentType } from '../../services/ollamaService';

interface AIAgentCardProps {
  agent: AgentInfo;
  isActive: boolean;
  isOnline: boolean;
  onClick: (agentId: AgentType) => void;
}

export const AIAgentCard: React.FC<AIAgentCardProps> = ({
  agent,
  isActive,
  isOnline,
  onClick,
}) => {
  return (
    <button
      onClick={() => onClick(agent.id)}
      className={`agent-card ${isActive ? 'agent-card--active' : ''} ${!isOnline ? 'agent-card--offline' : ''}`}
      disabled={!isOnline}
      title={!isOnline ? 'Ollama hors ligne' : agent.description}
    >
      <div className="agent-card__icon">{agent.icon}</div>
      <div className="agent-card__content">
        <div className="agent-card__name">{agent.name}</div>
        <div className="agent-card__desc">{agent.description}</div>
        <div className="agent-card__model">
          <span className={`agent-card__dot ${isOnline ? 'agent-card__dot--on' : 'agent-card__dot--off'}`} />
          {agent.model}
        </div>
      </div>
      {isActive && <div className="agent-card__active-badge">Actif</div>}

      <style>{`
        .agent-card {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1.5px solid #e5e7eb;
          background: white;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: all 0.15s ease;
          position: relative;
        }
        .agent-card:hover:not(:disabled) {
          border-color: #3b82f6;
          background: #eff6ff;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59,130,246,0.1);
        }
        .agent-card--active {
          border-color: #3b82f6;
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
        }
        .agent-card--offline { opacity: 0.5; cursor: not-allowed; }
        .agent-card__icon { font-size: 22px; flex-shrink: 0; line-height: 1; margin-top: 2px; }
        .agent-card__content { flex: 1; min-width: 0; }
        .agent-card__name {
          font-weight: 600;
          font-size: 14px;
          color: #111827;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .agent-card--active .agent-card__name { color: #1d4ed8; }
        .agent-card__desc { font-size: 12px; color: #6b7280; margin-top: 2px; line-height: 1.4; }
        .agent-card__model {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #9ca3af;
          margin-top: 4px;
          font-family: monospace;
        }
        .agent-card__dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .agent-card__dot--on { background: #10b981; box-shadow: 0 0 4px #10b981; }
        .agent-card__dot--off { background: #ef4444; }
        .agent-card__active-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #3b82f6;
          color: white;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 99px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}</style>
    </button>
  );
};

export default AIAgentCard;
