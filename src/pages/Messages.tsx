import { MessageSquare, Send, Paperclip, Search, MoreVertical, Phone, Video } from 'lucide-react';

export const Messages = () => {
    return (
        <div className="h-[calc(100vh-8rem)] flex gap-4">
            {/* Liste conversations */}
            <div className="w-80 bg-white rounded-xl border flex flex-col shadow-sm">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors ${i === 1 ? 'bg-purple-50 border-purple-100' : ''}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                                    U{i}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-semibold truncate">Utilisateur {i}</h3>
                                        <span className="text-xs text-gray-400">12:30</span>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">Dernier message reçu...</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Zone chat */}
            <div className="flex-1 bg-white rounded-xl border flex flex-col shadow-sm">
                <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                            U1
                        </div>
                        <div>
                            <h3 className="font-bold">Utilisateur 1</h3>
                            <p className="text-xs text-green-500 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                En ligne
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                            <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                            <Video className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                    <div className="flex justify-start">
                        <div className="bg-white border p-3 rounded-2xl rounded-tl-none max-w-[70%] shadow-sm">
                            <p className="text-gray-800">Bonjour, comment allez-vous ?</p>
                            <span className="text-[10px] text-gray-400 mt-1 block">12:30</span>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="bg-purple-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[70%] shadow-sm">
                            <p>Très bien merci, et vous ?</p>
                            <span className="text-[10px] text-purple-200 mt-1 block text-right">12:31</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t bg-white rounded-b-xl">
                    <div className="flex gap-2 items-center">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Paperclip className="w-5 h-5 text-gray-500" />
                        </button>
                        <input
                            type="text"
                            placeholder="Écrire un message..."
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                        />
                        <button className="p-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-sm">
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
