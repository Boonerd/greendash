"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sprout } from 'lucide-react';
import { Button } from './Button';
import { chatWithAgriBot } from '../services/geminiService';
import { Language } from '../types';

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

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for API (strip IDs and times)
      const apiHistory = newHistory.map(m => ({
        role: m.role,
        text: m.text
      }));

      // Fixed: Passing the array of message objects directly
      const result = await chatWithAgriBot(apiHistory);
      
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
    <div className="h-[calc(100vh-12rem)] flex flex-col bg-white dark:bg-forest-light/10 rounded-3xl border border-forest/10 shadow-xl shadow-forest/5 overflow-hidden animate-fade-in">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-linear-to-b from-cream/30 to-white dark:from-forest-dark/30 dark:to-forest-dark/10">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'bot' && (
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-lime to-forest flex items-center justify-center shadow-lg shadow-lime/30 shrink-0">
                {/* Replaced GiCow with Sprout (Lucide) as react-icons is not in package.json */}
                <Sprout size={28} className="text-white" />
              </div>
            )}
            <div className={`max-w-[85%] md:max-w-md px-6 py-4 rounded-3xl shadow-md text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-forest text-white shadow-forest/20 rounded-tr-none'
                : 'bg-white dark:bg-forest-dark border border-gray-100 dark:border-white/10 text-gray-800 dark:text-cream rounded-tl-none'
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <p className={`text-[10px] mt-2 text-right ${msg.role === 'user' ? 'text-white/60' : 'text-gray-400'}`}>
                {msg.time}
              </p>
            </div>
            {msg.role === 'user' && (
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-gold to-forest flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-gold/30 shrink-0">
                {/* Fallback to 'U' if text is empty, though input check prevents that */}
                {(msg.text.charAt(0) || 'U').toUpperCase()}
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-lime to-forest flex items-center justify-center shadow-lg shadow-lime/30">
              <Sprout size={28} className="text-white" />
            </div>
            <div className="bg-white dark:bg-forest-dark px-6 py-4 rounded-3xl border border-gray-100 dark:border-white/10 shadow-md rounded-tl-none">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-forest rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-lime rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-5 bg-white dark:bg-forest-dark border-t border-forest/10 dark:border-white/10">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={lang === 'sw' ? 'Uliza Agri-Bot chochote...' : 'Ask Agri-Bot anything...'}
            className="flex-1 px-6 py-4 rounded-2xl bg-cream dark:bg-white/5 border border-forest/20 dark:border-white/10 text-gray-800 dark:text-cream placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime focus:border-lime transition-all"
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()} 
            className="px-6 py-4 bg-forest hover:bg-forest-light text-white rounded-2xl shadow-lg shadow-forest/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
};