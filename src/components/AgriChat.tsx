"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from './Button';
import { chatWithAgriBot } from '../services/geminiService';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface ChatProps {
  lang: Language;
}

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  time: string;
}

export const AgriChat: React.FC<ChatProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      text: lang === 'sw' ? 'Mambo! Mimi ni Agri-Bot. Naweza kukusaidia aje leo?' : 'Hello! I am Agri-Bot. How can I help your farm today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => m.text);
    const responseText = await chatWithAgriBot(userMsg.text, history);

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'bot',
      text: responseText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-white dark:bg-forest-light/10 rounded-2xl border border-forest/10 dark:border-white/5 shadow-sm overflow-hidden animate-fade-in">
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-forest text-white' : 'bg-lime text-forest-dark'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-forest text-white rounded-tr-none' 
                : 'bg-cream dark:bg-forest-dark/80 dark:text-cream rounded-tl-none'
            }`}>
              <p>{msg.text}</p>
              <p className="text-[10px] opacity-50 mt-1 text-right">{msg.time}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-lime flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-cream dark:bg-forest-dark/80 p-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-forest/50 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-forest/50 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-forest/50 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 dark:bg-black/20 border-t border-gray-200 dark:border-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.chat}
            className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-forest-dark text-forest dark:text-cream focus:outline-none focus:ring-2 focus:ring-lime"
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            className="!px-4"
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};