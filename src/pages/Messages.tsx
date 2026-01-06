// ============================================================================
// PAGE MESSAGES - Messagerie - SchoolGenius
// ============================================================================
// Fichier : src/pages/Messages.tsx
// ============================================================================

import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Search,
  Paperclip,
  Image,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  Smile,
  X,
  Plus,
  Archive,
  Trash2,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface Message {
  id: string;
  conversationId: string;
  from: string;
  to: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'file';
  attachmentUrl?: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  type: 'individual' | 'group';
  participants?: string[];
}

// ============================================================================
// DONNÉES DE DÉMONSTRATION
// ============================================================================

const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Sophie Laurent',
    avatar: 'SL',
    lastMessage: 'Merci pour les documents !',
    lastMessageTime: '10:30',
    unreadCount: 2,
    online: true,
    type: 'individual',
  },
  {
    id: '2',
    name: 'Thomas Dubois',
    avatar: 'TD',
    lastMessage: 'À quelle heure la réunion ?',
    lastMessageTime: 'Hier',
    unreadCount: 0,
    online: false,
    type: 'individual',
  },
  {
    id: '3',
    name: 'Équipe Pédagogique',
    avatar: 'EP',
    lastMessage: 'Marie: Nouveau planning disponible',
    lastMessageTime: '15:45',
    unreadCount: 5,
    online: true,
    type: 'group',
    participants: ['Marie Petit', 'Jean Martin', 'Paul Bernard'],
  },
  {
    id: '4',
    name: 'Parents 5A',
    avatar: 'P5',
    lastMessage: 'Réunion confirmée pour vendredi',
    lastMessageTime: '09/01',
    unreadCount: 1,
    online: false,
    type: 'group',
    participants: ['30 participants'],
  },
  {
    id: '5',
    name: 'Direction',
    avatar: 'DR',
    lastMessage: 'Documents administratifs envoyés',
    lastMessageTime: '08/01',
    unreadCount: 0,
    online: true,
    type: 'individual',
  },
];

const DEMO_MESSAGES: Message[] = [
  {
    id: '1',
    conversationId: '1',
    from: 'Sophie Laurent',
    to: 'Me',
    content: 'Bonjour, avez-vous reçu les documents pour la réunion ?',
    timestamp: '2026-01-06T10:20:00',
    read: true,
    type: 'text',
  },
  {
    id: '2',
    conversationId: '1',
    from: 'Me',
    to: 'Sophie Laurent',
    content: 'Oui, je les ai bien reçus. Tout est en ordre !',
    timestamp: '2026-01-06T10:25:00',
    read: true,
    type: 'text',
  },
  {
    id: '3',
    conversationId: '1',
    from: 'Sophie Laurent',
    to: 'Me',
    content: 'Merci pour les documents !',
    timestamp: '2026-01-06T10:30:00',
    read: false,
    type: 'text',
  },
];

// ============================================================================
// UTILITAIRES
// ============================================================================

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatMessageTime = (timeStr: string): string => {
  const now = new Date();
  const today = now.toLocaleDateString('fr-FR');
  const yesterday = new Date(now.getTime() - 86400000).toLocaleDateString(
    'fr-FR'
  );

  if (timeStr.includes(':')) {
    return timeStr;
  }
  if (timeStr === today) {
    return "Aujourd'hui";
  }
  if (timeStr === yesterday) {
    return 'Hier';
  }
  return timeStr;
};

// ============================================================================
// COMPOSANT CONVERSATION
// ============================================================================

const ConversationItem = ({
  conversation,
  active,
  onClick,
}: {
  conversation: Conversation;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer transition-colors border-b border-gray-200 ${
        active ? 'bg-purple-50' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex gap-3">
        <div className="relative flex-shrink-0">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
              conversation.type === 'group'
                ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                : 'bg-gradient-to-br from-blue-500 to-blue-600'
            }`}
          >
            {conversation.avatar}
          </div>
          {conversation.online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-semibold text-gray-900 truncate">
              {conversation.name}
            </h4>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {formatMessageTime(conversation.lastMessageTime)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-sm truncate ${
                conversation.unreadCount > 0
                  ? 'font-semibold text-gray-900'
                  : 'text-gray-600'
              }`}
            >
              {conversation.lastMessage}
            </p>
            {conversation.unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-purple-600 text-white text-xs font-bold rounded-full flex-shrink-0">
                {conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPOSANT BULLE MESSAGE
// ============================================================================

const MessageBubble = ({
  message,
  isOwn,
}: {
  message: Message;
  isOwn: boolean;
}) => {
  return (
    <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {!isOwn && (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
          {message.from[0]}
        </div>
      )}

      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && (
          <span className="text-xs text-gray-500 mb-1">{message.from}</span>
        )}
        <div
          className={`max-w-md px-4 py-2.5 rounded-2xl ${
            isOwn
              ? 'bg-purple-600 text-white rounded-br-sm'
              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span
            className={`text-xs ${
              isOwn ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            {formatTime(message.timestamp)}
          </span>
          {isOwn && (
            <span>
              {message.read ? (
                <CheckCheck className="w-3 h-3 text-purple-600" />
              ) : (
                <Check className="w-3 h-3 text-gray-400" />
              )}
            </span>
          )}
        </div>
      </div>

      {isOwn && (
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm flex-shrink-0">
          Me
        </div>
      )}
    </div>
  );
};

// ============================================================================
// PAGE PRINCIPALE
// ============================================================================

export const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>(
    DEMO_CONVERSATIONS
  );
  const [selectedConversation, setSelectedConversation] = useState<
    Conversation | null
  >(DEMO_CONVERSATIONS[0]);
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filtrer conversations
  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtrer messages par conversation
  const conversationMessages = selectedConversation
    ? messages.filter((m) => m.conversationId === selectedConversation.id)
    : [];

  // Envoyer message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      conversationId: selectedConversation.id,
      from: 'Me',
      to: selectedConversation.name,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'text',
    };

    setMessages([...messages, message]);

    // Mettre à jour la conversation
    setConversations(
      conversations.map((conv) =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              lastMessage: newMessage,
              lastMessageTime: 'À l\'instant',
            }
          : conv
      )
    );

    setNewMessage('');
  };

  // Marquer comme lu
  const markAsRead = (conversationId: string) => {
    setConversations(
      conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    );
    setMessages(
      messages.map((msg) =>
        msg.conversationId === conversationId ? { ...msg, read: true } : msg
      )
    );
  };

  // Statistiques
  const totalUnread = conversations.reduce(
    (sum, conv) => sum + conv.unreadCount,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header avec stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">
            {totalUnread > 0
              ? `${totalUnread} message(s) non lu(s)`
              : 'Aucun message non lu'}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <Plus className="w-5 h-5" />
          Nouvelle conversation
        </button>
      </div>

      {/* Interface chat */}
      <div className="h-[calc(100vh-16rem)] flex gap-4">
        {/* Liste conversations (gauche) */}
        <div className="w-80 bg-white rounded-xl border border-gray-200 flex flex-col">
          {/* Recherche */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une conversation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Liste */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  active={selectedConversation?.id === conv.id}
                  onClick={() => {
                    setSelectedConversation(conv);
                    markAsRead(conv.id);
                  }}
                />
              ))
            ) : (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">Aucune conversation trouvée</p>
              </div>
            )}
          </div>
        </div>

        {/* Zone chat (centre) */}
        {selectedConversation ? (
          <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col">
            {/* Header conversation */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      selectedConversation.type === 'group'
                        ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                        : 'bg-gradient-to-br from-blue-500 to-blue-600'
                    }`}
                  >
                    {selectedConversation.avatar}
                  </div>
                  {selectedConversation.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {selectedConversation.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedConversation.online ? 'En ligne' : 'Hors ligne'}
                    {selectedConversation.type === 'group' &&
                      selectedConversation.participants &&
                      ` • ${selectedConversation.participants.length} participants`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {conversationMessages.length > 0 ? (
                <>
                  {conversationMessages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={message.from === 'Me'}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Aucun message</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Commencez la conversation !
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Input message */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <button
                  type="button"
                  className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  type="button"
                  className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Image className="w-5 h-5 text-gray-600" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrire un message..."
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="button"
                  className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Smile className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white rounded-xl border border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Sélectionnez une conversation
              </h3>
              <p className="text-gray-600">
                Choisissez une conversation pour commencer à discuter
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
