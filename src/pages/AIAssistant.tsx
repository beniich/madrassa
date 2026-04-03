// ============================================================
// AIAssistant.tsx — Page complète Agents IA
// ============================================================
import React, { useState, useEffect, useRef } from 'react';
import { useAIAgent } from '../hooks/useAIAgent';
import { AIStreamOutput } from '../components/ai/AIStreamOutput';
import { AIAgentCard } from '../components/ai/AIAgentCard';
import { AIInsightWidget } from '../components/ai/AIInsightWidget';
import {
  getAgents,
  checkOllamaStatus,
  type AgentType,
  type AgentInfo,
  type OllamaStatus,
} from '../services/ollamaService';

const SUGGESTED_PROMPTS: Record<AgentType | 'all', { text: string; agent: AgentType }[]> = {
  all: [
    { text: 'Quels élèves sont en difficulté cette semaine ?', agent: 'school_advisor' },
    { text: 'Génère le résumé statistique du jour', agent: 'analytics' },
    { text: "Y a-t-il des alertes d'absentéisme ?", agent: 'analytics' },
    { text: 'Rédige un bulletin pour un élève', agent: 'document' },
  ],
  school_advisor: [
    { text: 'Analyse les performances de la classe 6ème A', agent: 'school_advisor' },
    { text: 'Quels élèves ont plus de 5 absences ce mois ?', agent: 'school_advisor' },
    { text: 'Génère un rapport de suivi pour un élève', agent: 'school_advisor' },
  ],
  analytics: [
    { text: 'Quelle est la tendance des notes sur 30 jours ?', agent: 'analytics' },
    { text: 'Comparaison inter-classes des moyennes', agent: 'analytics' },
    { text: 'Génère les alertes de la semaine', agent: 'analytics' },
  ],
  scheduling: [
    { text: "Qui peut remplacer un enseignant absent demain ?", agent: 'scheduling' },
    { text: "Affiche l'emploi du temps de lundi", agent: 'scheduling' },
    { text: 'Y a-t-il des conflits de salles cette semaine ?', agent: 'scheduling' },
  ],
  document: [
    { text: 'Génère le bulletin scolaire du semestre 1', agent: 'document' },
    { text: 'Rédige une lettre de convocation pour les parents', agent: 'document' },
    { text: 'Compte rendu du dernier conseil de classe', agent: 'document' },
  ],
  chat: [
    { text: 'Explique-moi le règlement intérieur', agent: 'chat' },
    { text: 'Quels sont les agents IA disponibles ?', agent: 'chat' },
    { text: 'Comment fonctionne School Genius ?', agent: 'chat' },
  ],
};

export const AIAssistant: React.FC = () => {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<AgentType | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'chat' | 'insights'>('chat');
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    streaming,
    currentAgentName,
    currentAgentIcon,
    sessionId,
    sendMessage,
    clearHistory,
    isOllamaOnline,
  } = useAIAgent({ defaultAgent: selectedAgent });

  useEffect(() => {
    getAgents().then(setAgents).catch(() => {});
    checkOllamaStatus().then(setOllamaStatus).catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const currentSuggestions =
    selectedAgent
      ? SUGGESTED_PROMPTS[selectedAgent] || SUGGESTED_PROMPTS.all
      : SUGGESTED_PROMPTS.all;

  return (
    <div className="ai-page">
      {/* Sidebar */}
      <aside className="ai-sidebar">
        <div className={`ollama-status ${ollamaStatus?.online ? 'ollama-status--on' : 'ollama-status--off'}`}>
          <div className="ollama-status__dot" />
          <div>
            <div className="ollama-status__label">
              {ollamaStatus?.online ? 'Ollama en ligne' : 'Ollama hors ligne'}
            </div>
            {ollamaStatus?.models && ollamaStatus.models.length > 0 && (
              <div className="ollama-status__models">
                {ollamaStatus.models.slice(0, 2).join(' • ')}
              </div>
            )}
          </div>
        </div>

        <div className="ai-sidebar__section">
          <div className="ai-sidebar__section-title">Agents IA</div>
          <div className="ai-sidebar__agents">
            <button
              className={`agent-all-btn ${!selectedAgent ? 'agent-all-btn--active' : ''}`}
              onClick={() => setSelectedAgent(undefined)}
            >
              🔀 Détection automatique
            </button>
            {agents.map((agent) => (
              <AIAgentCard
                key={agent.id}
                agent={agent}
                isActive={selectedAgent === agent.id}
                isOnline={!!isOllamaOnline}
                onClick={setSelectedAgent}
              />
            ))}
          </div>
        </div>

        <div className="ai-sidebar__session">
          <div className="ai-sidebar__session-title">Session</div>
          <div className="ai-sidebar__session-id">{sessionId.slice(0, 12)}...</div>
          <button className="ai-sidebar__clear-btn" onClick={clearHistory}>
            🗑️ Effacer l'historique
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ai-main">
        <div className="ai-tabs">
          <button
            className={`ai-tab ${activeTab === 'chat' ? 'ai-tab--active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            💬 Chat IA
          </button>
          <button
            className={`ai-tab ${activeTab === 'insights' ? 'ai-tab--active' : ''}`}
            onClick={() => setActiveTab('insights')}
          >
            📊 Insights
          </button>
        </div>

        {activeTab === 'chat' && (
          <div className="ai-chat">
            {messages.length > 0 && (
              <div className="ai-chat__header">
                <span>{currentAgentIcon}</span>
                <span>{currentAgentName}</span>
                {streaming && <span className="ai-chat__streaming-badge">En cours...</span>}
              </div>
            )}

            <div className="ai-chat__messages">
              {messages.length === 0 && (
                <div className="ai-chat__empty">
                  <div className="ai-chat__empty-icon">🤖</div>
                  <h2>Assistant School Genius</h2>
                  <p>
                    {selectedAgent
                      ? `Agent sélectionné: ${agents.find((a) => a.id === selectedAgent)?.name}`
                      : "L'agent sera détecté automatiquement selon votre question"}
                  </p>
                  <div className="ai-chat__suggestions">
                    <div className="ai-chat__suggestions-title">Suggestions</div>
                    <div className="ai-chat__suggestions-grid">
                      {currentSuggestions.map((s, i) => (
                        <button
                          key={i}
                          className="ai-suggestion"
                          onClick={() => {
                            setSelectedAgent(s.agent);
                            sendMessage(s.text, s.agent);
                          }}
                          disabled={!isOllamaOnline}
                        >
                          {s.text}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <AIStreamOutput key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="ai-chat__input-area">
              <div className="ai-chat__input-row">
                <textarea
                  ref={inputRef}
                  className="ai-chat__textarea"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    !isOllamaOnline
                      ? '⚠️ Démarrez Ollama: ollama serve'
                      : selectedAgent
                      ? `Message pour ${agents.find((a) => a.id === selectedAgent)?.name}...`
                      : "Posez votre question à l'assistant IA..."
                  }
                  rows={2}
                  disabled={!isOllamaOnline || streaming}
                />
                <button
                  className="ai-chat__send"
                  onClick={handleSend}
                  disabled={!input.trim() || streaming || !isOllamaOnline}
                >
                  {streaming ? '⏳' : '➤'}
                </button>
              </div>
              <div className="ai-chat__input-hint">
                Entrée pour envoyer • Shift+Entrée pour nouvelle ligne
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="ai-insights-tab">
            <AIInsightWidget />
          </div>
        )}
      </main>

      <style>{`
        .ai-page {
          display: flex;
          height: 100vh;
          font-family: system-ui, -apple-system, sans-serif;
          background: #f8fafc;
          overflow: hidden;
        }
        .ai-sidebar {
          width: 280px;
          background: white;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 20px 16px;
          overflow-y: auto;
          flex-shrink: 0;
        }
        .ollama-status {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 10px; font-size: 13px;
        }
        .ollama-status--on { background: #f0fdf4; color: #166534; }
        .ollama-status--off { background: #fef2f2; color: #991b1b; }
        .ollama-status__dot {
          width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; animation: pulse 2s infinite;
        }
        .ollama-status--on .ollama-status__dot { background: #10b981; }
        .ollama-status--off .ollama-status__dot { background: #ef4444; animation: none; }
        .ollama-status__label { font-weight: 600; }
        .ollama-status__models { font-size: 11px; opacity: 0.7; margin-top: 2px; font-family: monospace; }
        .ai-sidebar__section-title {
          font-size: 11px; font-weight: 600; color: #6b7280;
          text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px;
        }
        .ai-sidebar__agents { display: flex; flex-direction: column; gap: 6px; }
        .agent-all-btn {
          width: 100%; padding: 8px 12px; border-radius: 10px;
          border: 1.5px dashed #d1d5db; background: transparent;
          font-size: 13px; color: #6b7280; cursor: pointer; text-align: left; transition: all 0.15s;
        }
        .agent-all-btn:hover { border-color: #3b82f6; color: #3b82f6; background: #eff6ff; }
        .agent-all-btn--active { border-color: #3b82f6; color: #1d4ed8; background: #dbeafe; font-weight: 600; }
        .ai-sidebar__session { margin-top: auto; padding-top: 16px; border-top: 1px solid #f3f4f6; }
        .ai-sidebar__session-title { font-size: 11px; color: #9ca3af; margin-bottom: 4px; }
        .ai-sidebar__session-id { font-family: monospace; font-size: 12px; color: #6b7280; margin-bottom: 8px; }
        .ai-sidebar__clear-btn {
          width: 100%; padding: 8px; border-radius: 8px; border: 1px solid #e5e7eb;
          background: white; font-size: 13px; color: #6b7280; cursor: pointer; transition: all 0.15s;
        }
        .ai-sidebar__clear-btn:hover { background: #fef2f2; color: #ef4444; border-color: #fecaca; }
        .ai-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .ai-tabs {
          display: flex; padding: 12px 20px 0; gap: 4px;
          border-bottom: 1px solid #e5e7eb; background: white;
        }
        .ai-tab {
          padding: 10px 20px; border-radius: 8px 8px 0 0; border: none;
          background: transparent; font-size: 14px; font-weight: 500;
          color: #6b7280; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.15s;
        }
        .ai-tab--active { color: #1d4ed8; border-bottom-color: #3b82f6; }
        .ai-tab:hover:not(.ai-tab--active) { color: #374151; background: #f9fafb; }
        .ai-chat { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .ai-chat__header {
          display: flex; align-items: center; gap: 8px; padding: 10px 20px;
          background: #eff6ff; border-bottom: 1px solid #bfdbfe;
          font-size: 13px; font-weight: 600; color: #1d4ed8;
        }
        .ai-chat__streaming-badge {
          margin-left: auto; background: #3b82f6; color: white;
          font-size: 11px; padding: 2px 8px; border-radius: 99px; animation: pulse 1.5s infinite;
        }
        .ai-chat__messages { flex: 1; overflow-y: auto; padding: 24px 20px; }
        .ai-chat__empty {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; text-align: center; height: 100%; gap: 12px; color: #374151;
        }
        .ai-chat__empty-icon { font-size: 56px; }
        .ai-chat__empty h2 { font-size: 22px; font-weight: 700; margin: 0; }
        .ai-chat__empty p { font-size: 14px; color: #6b7280; max-width: 360px; margin: 0; }
        .ai-chat__suggestions { width: 100%; max-width: 600px; margin-top: 12px; }
        .ai-chat__suggestions-title {
          font-size: 12px; color: #9ca3af; text-transform: uppercase;
          letter-spacing: 0.05em; margin-bottom: 10px;
        }
        .ai-chat__suggestions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .ai-suggestion {
          padding: 10px 14px; border-radius: 10px; border: 1.5px solid #e5e7eb;
          background: white; font-size: 13px; color: #374151; cursor: pointer;
          text-align: left; transition: all 0.15s; line-height: 1.4;
        }
        .ai-suggestion:hover:not(:disabled) {
          border-color: #3b82f6; color: #1d4ed8; background: #eff6ff; transform: translateY(-1px);
        }
        .ai-suggestion:disabled { opacity: 0.4; cursor: not-allowed; }
        .ai-chat__input-area { padding: 16px 20px; border-top: 1px solid #e5e7eb; background: white; }
        .ai-chat__input-row { display: flex; gap: 10px; align-items: flex-end; }
        .ai-chat__textarea {
          flex: 1; border: 1.5px solid #e5e7eb; border-radius: 14px;
          padding: 12px 16px; font-size: 14px; font-family: inherit;
          resize: none; outline: none; color: #111827; transition: border-color 0.15s;
          max-height: 120px; overflow-y: auto; line-height: 1.5;
        }
        .ai-chat__textarea:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .ai-chat__textarea:disabled { background: #f9fafb; }
        .ai-chat__send {
          width: 44px; height: 44px; border-radius: 12px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white; border: none; cursor: pointer; font-size: 18px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s;
        }
        .ai-chat__send:hover:not(:disabled) { transform: scale(1.05); box-shadow: 0 4px 12px rgba(59,130,246,0.3); }
        .ai-chat__send:disabled { opacity: 0.4; cursor: not-allowed; }
        .ai-chat__input-hint { font-size: 11px; color: #9ca3af; text-align: center; margin-top: 6px; }
        .ai-insights-tab { padding: 20px; overflow-y: auto; flex: 1; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
      `}</style>
    </div>
  );
};

export default AIAssistant;
