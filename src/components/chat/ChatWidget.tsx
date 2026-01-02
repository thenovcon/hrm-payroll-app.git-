'use client';

import { useState, useEffect, useRef } from 'react';
import { getConversations, getConversationMessages, sendChatMessage, createConversation } from '@/lib/actions/chat-v2-actions';

type ChatInterfaceProps = {
    user: {
        id: string;
        name?: string | null;
        username?: string; // If mapped
        role?: string;
    }
};

type Conversation = {
    id: string;
    type: 'DIRECT' | 'GROUP' | 'AI_ASSISTANT';
    name?: string | null;
    updatedAt: Date;
    participants: any[];
    messages: any[];
};

export default function ChatWidget({ user }: ChatInterfaceProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'LIST' | 'CHAT'>('LIST');
    const [activeConvId, setActiveConvId] = useState<string | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Load: Get Conversations
    useEffect(() => {
        if (isOpen && view === 'LIST') {
            loadConversations();
        }
    }, [isOpen, view]);

    // Polling for Messages if Chat is Open
    useEffect(() => {
        if (isOpen && view === 'CHAT' && activeConvId) {
            loadMessages(activeConvId);
            const interval = setInterval(() => loadMessages(activeConvId), 4000);
            return () => clearInterval(interval);
        }
    }, [isOpen, view, activeConvId]);

    // Auto-Scroll
    useEffect(() => {
        if (isOpen && view === 'CHAT') {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, view, isOpen]);

    const loadConversations = async () => {
        try {
            const data = await getConversations();
            setConversations(data as any);
        } catch (e) {
            console.error("Failed to load conversations", e);
        }
    };

    const loadMessages = async (convId: string) => {
        try {
            const msgs = await getConversationMessages(convId);
            setMessages(msgs);
        } catch (e) {
            console.error("Failed to load messages", e);
        }
    };

    const handleSelectConversation = (convId: string) => {
        setActiveConvId(convId);
        setMessages([]); // Clear prev
        setView('CHAT');
        loadMessages(convId);
    };

    const handleStartAIChat = async () => {
        setLoading(true);
        try {
            // Check if existing AI chat exists (Simple logic: just find one)
            const existing = conversations.find(c => c.type === 'AI_ASSISTANT');
            if (existing) {
                handleSelectConversation(existing.id);
            } else {
                // Create new
                const newConv = await createConversation([], 'AI_ASSISTANT', 'HR Assistant');
                handleSelectConversation(newConv.id);
            }
        } catch (e) {
            alert("Failed to start AI Chat");
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !activeConvId) return;

        setLoading(true);
        try {
            await sendChatMessage(activeConvId, inputValue);
            setInputValue('');
            await loadMessages(activeConvId);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 sm:w-96 h-[500px] mb-4 flex flex-col pointer-events-auto overflow-hidden animate-in slide-in-from-bottom-2 fade-in">

                    {/* HEADER */}
                    <div className="bg-primary-600 text-white p-4 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-2">
                            {view === 'CHAT' && (
                                <button onClick={() => setView('LIST')} className="mr-1 hover:bg-white/10 rounded-full p-1 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                            )}
                            <div>
                                <h3 className="font-bold">{view === 'LIST' ? 'Messages' : (conversations.find(c => c.id === activeConvId)?.name || 'Chat')}</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                    <span className="text-xs opacity-90 text-primary-100">Online as {user.name?.split(' ')[0]}</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* BODY: LIST VIEW */}
                    {view === 'LIST' && (
                        <div className="flex-1 overflow-y-auto p-2 bg-slate-50">
                            <button
                                onClick={handleStartAIChat}
                                className="w-full flex items-center gap-3 p-3 bg-white border border-indigo-100 rounded-xl shadow-sm hover:shadow-md transition mb-3 group"
                            >
                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-slate-800">Ask HR Assistant</p>
                                    <p className="text-xs text-slate-500">Instant answers from policies</p>
                                </div>
                            </button>

                            <div className="space-y-2">
                                {conversations.length === 0 ? (
                                    <p className="text-center text-slate-400 text-sm mt-8">No conversations yet.</p>
                                ) : (
                                    conversations.map(conv => (
                                        <button
                                            key={conv.id}
                                            onClick={() => handleSelectConversation(conv.id)}
                                            className="w-full text-left p-3 bg-white rounded-lg border border-slate-100 hover:border-primary-200 transition flex items-center gap-3"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                                {conv.type === 'AI_ASSISTANT' ? '🤖' : '👥'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-0.5">
                                                    <p className="font-medium text-slate-700 truncate text-sm">{conv.name || 'Untitled Chat'}</p>
                                                    <span className="text-[10px] text-slate-400">{new Date(conv.updatedAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 truncate">{conv.messages?.[0]?.content || 'No messages'}</p>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* BODY: CHAT VIEW */}
                    {view === 'CHAT' && (
                        <>
                            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50">
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
                                        <p>Start the conversation!</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const isMe = msg.senderId === user.id;
                                        const isAi = msg.isAiGenerated;
                                        return (
                                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[85%] rounded-2xl px-3 py-2 ${isMe ? 'bg-primary-600 text-white rounded-tr-sm' :
                                                        isAi ? 'bg-indigo-50 border border-indigo-100 text-slate-800 rounded-tl-sm' :
                                                            'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
                                                    }`}>
                                                    {!isMe && (
                                                        <p className="text-[10px] font-bold opacity-60 mb-0.5 flex items-center gap-1">
                                                            {isAi && '🤖'} {msg.sender?.employee?.firstName || msg.sender?.username}
                                                        </p>
                                                    )}
                                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                    <p className={`text-[9px] mt-0.5 text-right ${isMe ? 'opacity-70' : 'text-slate-400'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !inputValue.trim()}
                                    className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition disabled:opacity-50 shadow-sm"
                                >
                                    <svg className="w-5 h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                </button>
                            </form>
                        </>
                    )}
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 ${isOpen ? 'bg-slate-700 text-white rotate-90' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                )}
            </button>
        </div>
    );
}
