'use client';

import { useState, useEffect, useRef } from 'react';
import { createConversation, getConversations, getConversationMessages, sendChatMessage } from '@/lib/actions/chat-v2-actions';
import { usePathname } from 'next/navigation';

export default function FloatingChatWidget({ userId }: { userId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'AI' | 'CHATS'>('AI');
    const [conversations, setConversations] = useState<any[]>([]);
    const [activeConvId, setActiveConvId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    // Auto-init AI chat if needed
    useEffect(() => {
        console.log("FloatingChatWidget Mounted. UserId:", userId);
        if (isOpen && activeTab === 'AI' && !activeConvId) {
            initAIChat();
        }
        if (isOpen && activeTab === 'CHATS') {
            loadConversations();
        }
    }, [isOpen, activeTab, userId]);

    // Poll messages if active conv
    useEffect(() => {
        if (!activeConvId || !isOpen) return;
        const interval = setInterval(loadMessages, 3000);
        loadMessages();
        return () => clearInterval(interval);
    }, [activeConvId, isOpen]);

    const initAIChat = async () => {
        // Find existing AI Chat
        const chats = await getConversations();
        const aiChat = chats.find((c: any) => c.type === 'AI_ASSISTANT');
        if (aiChat) {
            setActiveConvId(aiChat.id);
        } else {
            // Create new
            try {
                const newChat = await createConversation([], 'AI_ASSISTANT', 'HR Assistant');
                setActiveConvId(newChat.id);
            } catch (e) {
                console.error("Failed to init AI chat", e);
            }
        }
    };

    const loadConversations = async () => {
        const chats = await getConversations();
        setConversations(chats.filter((c: any) => c.type !== 'AI_ASSISTANT'));
    };

    const loadMessages = async () => {
        if (!activeConvId) return;
        const msgs = await getConversationMessages(activeConvId);
        setMessages(msgs);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !activeConvId) return;

        setLoading(true);
        const tempContent = input;
        setInput(''); // Optimistic clear

        try {
            await sendChatMessage(activeConvId, tempContent);
            await loadMessages();
        } catch (e) {
            console.error(e);
            setInput(tempContent); // Revert
        } finally {
            setLoading(false);
        }
    };

    if (!userId) return null;

    return (
        <div className="fixed bottom-4 right-4 md:bottom-10 md:right-10 z-[9999] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[calc(100vw-2rem)] md:w-96 h-[500px] max-h-[80vh] bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="bg-slate-900 text-white p-3 flex justify-between items-center">
                        <div className="flex gap-2 text-sm font-medium">
                            <button
                                onClick={() => { setActiveTab('AI'); setActiveConvId(null); }}
                                className={`px-3 py-1 rounded-full transition ${activeTab === 'AI' ? 'bg-primary-600' : 'hover:bg-slate-800'}`}
                            >
                                🤖 Ask AI
                            </button>
                            <button
                                onClick={() => { setActiveTab('CHATS'); setActiveConvId(null); }}
                                className={`px-3 py-1 rounded-full transition ${activeTab === 'CHATS' ? 'bg-primary-600' : 'hover:bg-slate-800'}`}
                            >
                                💬 Chats
                            </button>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden flex flex-col bg-slate-50">
                        {activeTab === 'CHATS' && !activeConvId ? (
                            <div className="p-2 overflow-y-auto h-full">
                                {conversations.length === 0 && <p className="text-xs text-slate-500 text-center mt-4">No active conversations.</p>}
                                {conversations.map(chat => (
                                    <div
                                        key={chat.id}
                                        onClick={() => setActiveConvId(chat.id)}
                                        className="p-3 bg-white rounded-lg mb-2 shadow-sm cursor-pointer hover:bg-slate-50 transition"
                                    >
                                        <p className="text-sm font-semibold text-slate-800">{chat.name || 'Conversation'}</p>
                                        <p className="text-xs text-slate-500 truncate">{chat.messages[0]?.content || 'No messages'}</p>
                                    </div>
                                ))}
                                <button className="w-full mt-2 py-2 text-xs text-primary-600 border border-primary-200 rounded hover:bg-primary-50">
                                    + New Chat
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col h-full">
                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {messages.map(msg => {
                                        const isMe = msg.senderId === userId;
                                        return (
                                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${isMe ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white border border-slate-200 rounded-bl-none'}`}>
                                                    {msg.isAiGenerated && <span className="text-[10px] font-bold block mb-1 text-purple-600">✨ AI Assistant</span>}
                                                    {msg.content}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {loading && <div className="text-xs text-slate-400 text-center animate-pulse">Thinking...</div>}
                                </div>

                                {/* Input Key */}
                                <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200">
                                    <div className="flex gap-2">
                                        <input
                                            className="flex-1 text-sm border border-slate-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
                                            placeholder="Type a message..."
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!input.trim() || loading}
                                            className="bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary-700 disabled:opacity-50"
                                        >
                                            ➤
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Trigger Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-gradient-to-tr from-primary-600 to-indigo-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center"
                >
                    <span className="text-3xl">💬</span>
                </button>
            )}
        </div>
    );
}
