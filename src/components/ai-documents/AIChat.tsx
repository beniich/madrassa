import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Message {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
}

interface AIChatProps {
    initialMessage?: string;
    placeholder?: string;
}

export const AIChat = ({ initialMessage = "👋 Comment puis-je vous aider ?", placeholder = "Posez une question..." }: AIChatProps) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: initialMessage,
            isUser: false,
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');

        // Simulate AI response
        setTimeout(() => {
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: "Je peux vous aider avec ça ! Laissez-moi analyser...",
                isUser: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
        }, 500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 space-y-3" style={{ maxHeight: '400px' }}>
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom duration-300`}
                    >
                        <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2 ${message.isUser
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                    : 'bg-white text-gray-900 border border-gray-200'
                                }`}
                        >
                            <p className="text-sm">{message.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            <div className="mt-3 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                    onClick={handleSend}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
