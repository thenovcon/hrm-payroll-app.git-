'use client';

import { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage } from '@/lib/actions/chat-actions'; // Server actions

type ChatInterfaceProps = {
    user: {
        id: string;
        name?: string | null;
        username?: string; // If mapped
        role?: string;
    }
};

export default function ChatInterface({ user }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async () => {
        try {
            const msgs = await getMessages('GENERAL');
            setMessages(msgs);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        setLoading(true);
        try {
            await sendMessage(inputValue, 'GENERAL');
            setInputValue('');
            await fetchMessages(); // Immediate refresh
        } catch (e) {
            alert('Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)]">
            <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-slate-800">Company Chat</h1>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">● Online as {user.name || user.username}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((msg) => {
                    // Check if sender is me (by ID or username)
                    const isMe = msg.senderId === user.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-lg p-3 ${isMe ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200'}`}>
                                {!isMe && (
                                    <p className="text-xs font-bold text-slate-500 mb-1">
                                        {msg.sender?.employee?.firstName || msg.sender?.username}
                                    </p>
                                )}
                                <p className="text-sm">{msg.content}</p>
                                <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-100' : 'text-slate-400'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !inputValue.trim()}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
