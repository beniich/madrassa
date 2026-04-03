// ============================================================
// AIChatPanel.tsx — Panel de chat flottant multi-agents
// ============================================================
import React, { useState, useRef, useEffect } from 'react';
import { useAIAgent } from '../../hooks/useAIAgent';
import { AIStreamOutput } from './AIStreamOutput';
import { AIAgentCard } from './AIAgentCard';
import { getAgents, type AgentType, type AgentInfo } from '../../services/ollamaService';

const QUICK_PROMPTS: { label: string; prompt: string; agent: AgentType }[] = [
  { label: '📉 Élèves en difficulté', prompt: 'Quels élèves sont actuellement en difficulté ?', agent: 'school_advisor' },
  { label: '📊 Résumé du jour', prompt: 'Génère un résumé statistique de la journée', agent: 'analytics' },
  { label: '📅 Absences aujourd\'hui', prompt: 'Combien d\'absences avons-nous aujourd\'hui ?', agent: 'analytics' },
  { label: '📄 Rédiger une lettre', prompt: 'Rédige une lettre de convocation pour un parent', agent: 'document' },
];

export const AIChatPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAgents, setShowAgents] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentType | undefined>(undefined);
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    streaming,
    currentAgentName,
    currentAgentIcon,
    isOllamaOnline,
    sendMessage,
    clearHistory,
  } = useAIAgent({ defaultAgent: selectedAgent });

  useEffect(() => {
    getAgents().then(setAgents).catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || streaming) return;
    const msg = input;
    setInput('');
    await sendMessage(msg, selectedAgent);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPrompt = (prompt: string, agent: AgentType) => {
    setSelectedAgent(agent);
    sendMessage(prompt, agent);
  };

  const activeAgentInfo = agents.find((a) => a.id === selectedAgent);

  return (
    <>
      {/* Bouton flottant */}
      <button
        className={`ai-fab ${isOpen ? 'ai-fab--open' : ''} ${isOllamaOnline === false ? 'ai-fab--offline' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={isOllamaOnline === false ? 'Ollama hors ligne' : 'Assistant IA'}
      >
        {isOpen ? '✕' : '🤖'}
        {isOllamaOnline && messages.filter((m) => m.role === 'assistant').length === 0 && (
          <span className="ai-fab__pulse" />
        )}
      </button>

      {/* Panel principal */}
      {isOpen && (
        <div className="ai-panel">
          {/* Header */}
          <div className="ai-panel__header">
            <div className="ai-panel__header-left">
              <span className="ai-panel__icon">{currentAgentIcon || activeAgentInfo?.icon || '🤖'}</span>
              <div>
                <div className="ai-panel__title">School Genius AI</div>
                <div className="ai-panel__subtitle">
                  {streaming ? (
                    <span className="ai-panel__typing">
                      <span /><span /><span />
                      {currentAgentName} génère...
                    </span>
                  ) : (
                    <span className={`ai-panel__status ${isOllamaOnline ? 'ai-panel__status--on' : 'ai-panel__status--off'}`}>
                      ● {isOllamaOnline ? 'En ligne' : 'Hors ligne'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="ai-panel__header-actions">
              <button className="ai-icon-btn" onClick={() => setShowAgents(!showAgents)} title="Choisir un agent">🧠</button>
              <button className="ai-icon-btn" onClick={clearHistory} title="Effacer">🗑️</button>
              <button className="ai-icon-btn" onClick={() => setIsOpen(false)}>✕</button>
            </div>
          </div>

          {/* Sélecteur d'agents */}
          {showAgents && agents.length > 0 && (
            <div className="ai-panel__agents">
              <div className="ai-panel__agents-title">Choisir un agent</div>
              <div className="ai-panel__agents-grid">
                {agents.map((agent) => (
                  <AIAgentCard
                    key={agent.id}
                    agent={agent}
                    isActive={selectedAgent === agent.id}
                    isOnline={!!isOllamaOnline}
                    onClick={(id) => { setSelectedAgent(id); setShowAgents(false); }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="ai-panel__messages">
            {messages.length === 0 && (
              <div className="ai-panel__welcome">
                <div className="ai-panel__welcome-icon">🏫</div>
                <div className="ai-panel__welcome-title">Bonjour !</div>
                <div className="ai-panel__welcome-text">
                  Je suis votre assistant School Genius. Comment puis-je vous aider ?
                </div>
                <div className="ai-panel__quick-prompts">
                  {QUICK_PROMPTS.map((qp, i) => (
                    <button
                      key={i}
                      className="ai-quick-prompt"
                      onClick={() => handleQuickPrompt(qp.prompt, qp.agent)}
                      disabled={!isOllamaOnline || streaming}
                    >
                      {qp.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg) => (
              <AIStreamOutput key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="ai-panel__input">
            {selectedAgent && activeAgentInfo && (
              <div className="ai-panel__agent-indicator">
                <span>{activeAgentInfo.icon}</span>
                <span>{activeAgentInfo.name}</span>
                <button className="ai-agent-clear" onClick={() => setSelectedAgent(undefined)}>✕</button>
              </div>
            )}
            <div className="ai-panel__input-row">
              <textarea
                ref={inputRef}
                className="ai-panel__textarea"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isOllamaOnline === false
                    ? 'Ollama hors ligne — démarrez Ollama d\'abord'
                    : 'Posez votre question... (Entrée pour envoyer)'
                }
                rows={1}
                disabled={!isOllamaOnline || streaming}
              />
              <button
                className={`ai-send-btn ${streaming ? 'ai-send-btn--streaming' : ''}`}
                onClick={handleSend}
                disabled={!input.trim() || streaming || !isOllamaOnline}
              >
                {streaming ? '⏳' : '➤'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .ai-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          font-size: 22px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(59,130,246,0.4);
          z-index: 1000;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ai-fab:hover { transform: scale(1.08); box-shadow: 0 6px 24px rgba(59,130,246,0.5); }
        .ai-fab--open { background: linear-gradient(135deg, #ef4444, #dc2626); }
        .ai-fab--offline { background: linear-gradient(135deg, #9ca3af, #6b7280); }
        .ai-fab__pulse {
          position: absolute;
          top: -2px; right: -2px;
          width: 14px; height: 14px;
          background: #10b981;
          border-radius: 50%;
          border: 2px solid white;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
        .ai-panel {
          position: fixed;
          bottom: 92px;
          right: 24px;
          width: 420px;
          max-height: 600px;
          border-radius: 20px;
          background: white;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          z-index: 999;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: system-ui, -apple-system, sans-serif;
          animation: slideUp 0.2s ease;
        }
        @keyframes slideUp {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media (max-width: 480px) {
          .ai-panel { width: calc(100vw - 16px); right: 8px; bottom: 80px; max-height: 70vh; }
        }
        .ai-panel__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: linear-gradient(135deg, #1e3a8a, #1d4ed8);
          color: white;
        }
        .ai-panel__header-left { display: flex; align-items: center; gap: 10px; }
        .ai-panel__icon { font-size: 24px; }
        .ai-panel__title { font-weight: 700; font-size: 15px; }
        .ai-panel__subtitle { font-size: 12px; opacity: 0.8; margin-top: 2px; }
        .ai-panel__status { display: flex; align-items: center; gap: 4px; }
        .ai-panel__status--on { color: #86efac; }
        .ai-panel__status--off { color: #fca5a5; }
        .ai-panel__typing { display: flex; align-items: center; gap: 4px; color: #93c5fd; }
        .ai-panel__typing span {
          width: 4px; height: 4px; background: #93c5fd; border-radius: 50%;
          animation: bounce 0.6s infinite alternate;
        }
        .ai-panel__typing span:nth-child(2) { animation-delay: 0.2s; }
        .ai-panel__typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-4px); } }
        .ai-panel__header-actions { display: flex; gap: 4px; }
        .ai-icon-btn {
          background: rgba(255,255,255,0.15);
          border: none; color: white;
          width: 30px; height: 30px;
          border-radius: 8px; cursor: pointer;
          font-size: 14px; transition: background 0.15s;
          display: flex; align-items: center; justify-content: center;
        }
        .ai-icon-btn:hover { background: rgba(255,255,255,0.25); }
        .ai-panel__agents {
          padding: 12px;
          border-bottom: 1px solid #f3f4f6;
          background: #fafafa;
          max-height: 280px;
          overflow-y: auto;
        }
        .ai-panel__agents-title {
          font-size: 11px; font-weight: 600; color: #6b7280;
          text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;
        }
        .ai-panel__agents-grid { display: flex; flex-direction: column; gap: 6px; }
        .ai-panel__messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; min-height: 0; }
        .ai-panel__welcome { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 24px 16px; gap: 8px; }
        .ai-panel__welcome-icon { font-size: 40px; }
        .ai-panel__welcome-title { font-weight: 700; font-size: 18px; color: #111827; }
        .ai-panel__welcome-text { font-size: 14px; color: #6b7280; max-width: 280px; }
        .ai-panel__quick-prompts { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-top: 12px; }
        .ai-quick-prompt {
          padding: 6px 12px; border-radius: 99px; border: 1.5px solid #e5e7eb;
          background: white; font-size: 12px; cursor: pointer; color: #374151; transition: all 0.15s;
        }
        .ai-quick-prompt:hover:not(:disabled) { border-color: #3b82f6; color: #1d4ed8; background: #eff6ff; }
        .ai-quick-prompt:disabled { opacity: 0.4; cursor: not-allowed; }
        .ai-panel__input { border-top: 1px solid #f3f4f6; padding: 12px; background: white; }
        .ai-panel__agent-indicator {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: #3b82f6; background: #eff6ff;
          border-radius: 8px; padding: 4px 10px; margin-bottom: 8px; font-weight: 500;
        }
        .ai-agent-clear { margin-left: auto; background: none; border: none; color: #93c5fd; cursor: pointer; font-size: 11px; }
        .ai-panel__input-row { display: flex; gap: 8px; align-items: flex-end; }
        .ai-panel__textarea {
          flex: 1; border: 1.5px solid #e5e7eb; border-radius: 12px;
          padding: 10px 14px; font-size: 14px; font-family: inherit;
          resize: none; outline: none; color: #111827;
          transition: border-color 0.15s; max-height: 100px; overflow-y: auto;
        }
        .ai-panel__textarea:focus { border-color: #3b82f6; }
        .ai-panel__textarea:disabled { background: #f9fafb; color: #9ca3af; cursor: not-allowed; }
        .ai-send-btn {
          width: 40px; height: 40px; border-radius: 12px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white; border: none; cursor: pointer; font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.15s;
        }
        .ai-send-btn:hover:not(:disabled) { transform: scale(1.05); }
        .ai-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .ai-send-btn--streaming { background: linear-gradient(135deg, #f59e0b, #d97706); }
      `}</style>
    </>
  );
};

export default AIChatPanel;
