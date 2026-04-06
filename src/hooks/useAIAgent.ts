// ============================================================
// useAIAgent.ts — Hook React pour les agents IA
// ============================================================
import { useState, useCallback, useRef, useEffect } from 'react';
import {
  streamChat,
  clearHistory as apiClearHistory,
  getHistory,
  type AIMessage,
  type AgentType,
} from '../services/ollamaService';

interface UseAIAgentOptions {
  defaultAgent?: AgentType;
  sessionId?: string;
  autoLoadHistory?: boolean;
}

interface UseAIAgentReturn {
  messages: AIMessage[];
  streaming: boolean;
  currentAgent: AgentType | null;
  currentAgentName: string;
  currentAgentIcon: string;
  sessionId: string;
  sendMessage: (content: string, agentHint?: AgentType, model?: string, isStrict?: boolean) => Promise<void>;
  clearHistory: () => Promise<void>;
  isOllamaOnline: boolean | null;
}

export function useAIAgent(options: UseAIAgentOptions = {}): UseAIAgentReturn {
  const { defaultAgent, sessionId: initialSessionId, autoLoadHistory = false } = options;

  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<AgentType | null>(defaultAgent || null);
  const [currentAgentName, setCurrentAgentName] = useState('Assistant');
  const [currentAgentIcon, setCurrentAgentIcon] = useState('🤖');
  const [sessionId, setSessionId] = useState(initialSessionId || crypto.randomUUID());
  const [isOllamaOnline, setIsOllamaOnline] = useState<boolean | null>(null);

  const streamingMessageIdRef = useRef<string | null>(null);

  useEffect(() => {
    fetch('/api/ai/status')
      .then((r) => r.json())
      .then((data) => setIsOllamaOnline(data.online))
      .catch(() => setIsOllamaOnline(false));
  }, []);

  useEffect(() => {
    if (autoLoadHistory && sessionId) {
      getHistory(sessionId).then((history) => {
        if (history.length > 0) setMessages(history);
      });
    }
  }, [sessionId, autoLoadHistory]);

  const sendMessage = useCallback(
    async (content: string, agentHint?: AgentType, model?: string, isStrict?: boolean) => {
      if (!content.trim() || streaming) return;

      const userMessage: AIMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setStreaming(true);

      const assistantId = crypto.randomUUID();
      streamingMessageIdRef.current = assistantId;

      const assistantMessage: AIMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        streaming: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      try {
        await streamChat({
          message: content,
          sessionId,
          agentHint: agentHint || defaultAgent,
          model,
          isStrict,
          onToken: (token) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: m.content + token } : m
              )
            );
          },
          onAgent: (agentData) => {
            setCurrentAgent(agentData.agentId);
            setCurrentAgentName(agentData.agentName);
            setCurrentAgentIcon(agentData.agentIcon);
            setSessionId(agentData.sessionId);

            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      agentId: agentData.agentId,
                      agentName: agentData.agentName,
                      agentIcon: agentData.agentIcon,
                    }
                  : m
              )
            );
          },
          onDone: (finalSessionId) => {
            setSessionId(finalSessionId);
            setStreaming(false);
            streamingMessageIdRef.current = null;

            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, streaming: false } : m
              )
            );
          },
          onError: (error) => {
            console.error('[useAIAgent] Error:', error);
            setStreaming(false);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      content: `❌ Error: ${error}. Vérifiez qu'Ollama est démarré.`,
                      streaming: false,
                    }
                  : m
              )
            );
          },
        });
      } catch (err) {
        setStreaming(false);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: `❌ Impossible de joindre le serveur AI. Vérifiez votre connexion.`,
                  streaming: false,
                }
              : m
          )
        );
      }
    },
    [streaming, sessionId, defaultAgent]
  );

  const clearHistory = useCallback(async () => {
    await apiClearHistory(sessionId);
    setMessages([]);
    setSessionId(crypto.randomUUID());
  }, [sessionId]);

  return {
    messages,
    streaming,
    currentAgent,
    currentAgentName,
    currentAgentIcon,
    sessionId,
    sendMessage,
    clearHistory,
    isOllamaOnline,
  };
}
