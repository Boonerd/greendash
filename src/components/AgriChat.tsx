"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from './Button';
import { chatWithAgriBot } from '../services/geminiService';
import { Language } from '../types';
import { GiCow } from "react-icons/gi";

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  time: string;
}

export const AgriChat: React.FC<{ lang: Language }> = ({ lang }) => {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    role: 'bot',
    text: lang === 'sw' ? 'Mambo farmer! Mimi ni Agri-Bot. Una swali gani leo?' : 'Hello farmer! I am Agri-Bot. How can I help you today?',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => m.text);
      const result = await chatWithAgriBot(userMsg.text, history);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: result,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'bot',
        text: "Samahani, kuna hitilafu. Jaribu tena.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col bg-white dark:bg-[#142814] rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'bot' && (
              <div className="w-12 h-12 rounded-full bg-lime flex items-center justify-center shadow-lg">
                <GiCow size={28} className="text-forest" />
              </div>
            )}
            <div className={`max-w-md px-5 py-4 rounded-3xl shadow-md text-sm ${
              msg.role === 'user'
                ? 'bg-forest text-cream'
                : 'bg-cream dark:bg-[#0b180b] text-gray-900 dark:text-cream border border-gray-200 dark:border-white/10'
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <p className="text-xs opacity-60 text-right mt-2">{msg.time}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-lime flex items-center justify-center shadow-lg">
              <GiCow size={28} className="text-forest" />
            </div>
            <div className="bg-cream dark:bg-[#0b180b] px-5 py-4 rounded-3xl border border-gray-200 dark:border-white/10">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-forest-light rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-forest-light rounded-full animate-bounce delay-100"></div>
                <div className="w-3 h-3 bg-forest-light rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-cream dark:bg-[#0b180b] border-t border-gray-200 dark:border-white/10">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask Agri-Bot..."
            className="flex-1 px-6 py-4 rounded-2xl bg-white dark:bg-[#142814] border border-gray-300 dark:border-white/20 text-gray-900 dark:text-cream placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime transition-all"
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="px-6 py-4 bg-forest hover:bg-forest-light text-cream rounded-2xl shadow-lg">
            <Send size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
};