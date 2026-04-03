// ============================================================
// AIStreamOutput.tsx — Affichage streaming avec effet machine à écrire
// ============================================================
import React, { useEffect, useRef } from 'react';
import type { AIMessage } from '../../services/ollamaService';

interface AIStreamOutputProps {
  message: AIMessage;
  className?: string;
}

function renderMarkdown(text: string): string {
  return text
    .replace(/^### (.+)$/gm, '<h3 class="ai-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="ai-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="ai-h1">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="ai-code-inline">$1</code>')
    .replace(/^[•\-\*] (.+)$/gm, '<li class="ai-li">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul class="ai-ul">$&</ul>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ai-li-num">$1</li>')
    .replace(/^---$/gm, '<hr class="ai-hr" />')
    .replace(/\n\n/g, '</p><p class="ai-p">')
    .replace(/\n/g, '<br />');
}

export const AIStreamOutput: React.FC<AIStreamOutputProps> = ({ message, className = '' }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message.streaming && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [message.content, message.streaming]);

  const isUser = message.role === 'user';

  return (
    <div
      ref={contentRef}
      className={`ai-message ${isUser ? 'ai-message--user' : 'ai-message--assistant'} ${className}`}
    >
      {!isUser && (message.agentIcon || message.agentName) && (
        <div className="ai-agent-badge">
          <span>{message.agentIcon || '🤖'}</span>
          <span className="ai-agent-name">{message.agentName || 'Assistant'}</span>
        </div>
      )}

      <div className="ai-bubble">
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <>
            <div
              className="ai-markdown"
              dangerouslySetInnerHTML={{
                __html: `<p class="ai-p">${renderMarkdown(message.content || '')}</p>`,
              }}
            />
            {message.streaming && <span className="ai-cursor">▋</span>}
          </>
        )}
      </div>

      <span className="ai-timestamp">
        {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
      </span>

      <style>{`
        .ai-message {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
          max-width: 100%;
        }
        .ai-message--user { align-items: flex-end; }
        .ai-message--assistant { align-items: flex-start; }
        .ai-agent-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 4px;
          margin-left: 4px;
        }
        .ai-agent-name {
          font-weight: 500;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .ai-bubble {
          padding: 12px 16px;
          border-radius: 16px;
          max-width: 85%;
          line-height: 1.6;
          font-size: 14px;
          position: relative;
        }
        .ai-message--user .ai-bubble {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border-bottom-right-radius: 4px;
        }
        .ai-message--assistant .ai-bubble {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          color: #111827;
          border-bottom-left-radius: 4px;
        }
        .ai-cursor {
          display: inline-block;
          animation: blink 1s infinite;
          margin-left: 2px;
          color: #3b82f6;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .ai-timestamp {
          font-size: 11px;
          color: #9ca3af;
          margin-top: 4px;
          padding: 0 4px;
        }
        .ai-markdown h1, .ai-markdown h2, .ai-markdown h3 {
          margin: 8px 0 4px 0;
          font-weight: 600;
        }
        .ai-h1 { font-size: 1.2em; }
        .ai-h2 { font-size: 1.1em; }
        .ai-h3 { font-size: 1em; color: #374151; }
        .ai-p { margin: 6px 0; }
        .ai-ul { margin: 6px 0 6px 16px; padding: 0; list-style: disc; }
        .ai-li, .ai-li-num { margin: 3px 0; }
        .ai-code-inline {
          background: #f3f4f6;
          padding: 1px 5px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.9em;
          color: #dc2626;
        }
        .ai-hr { border: none; border-top: 1px solid #e5e7eb; margin: 10px 0; }
        strong { font-weight: 600; }
        em { font-style: italic; }
      `}</style>
    </div>
  );
};

export default AIStreamOutput;
