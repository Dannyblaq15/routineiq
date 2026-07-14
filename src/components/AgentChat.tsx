'use client';

import { useChat } from '@ai-sdk/react';
import { motion } from 'motion/react';
import { Sparkles, Send, Bot, User, ArrowLeft } from 'lucide-react';
import { ScreenType } from '../types';
import { useEffect, useRef, useState } from 'react';

export default function AgentChat({ onNavigate }: { onNavigate: (s: ScreenType) => void }) {
  const { messages, setMessages, sendMessage, status, error, stop } = useChat();
  const [input, setInput] = useState('');
  
  const isLoading = status === 'submitted' || status === 'streaming';

  // Load chat history on mount
  useEffect(() => {
    const saved = localStorage.getItem('routineiq_chat_history');
    if (saved && messages.length === 0) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save chat history on update
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('routineiq_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

const SCREEN_NAMES: Record<string, string> = {
  'agent-dashboard': 'AI Dashboard',
  'memory-timeline': 'My History',
  'agent-insights': 'Agent Insights',
  'chat': 'Ask Agent',
  'analysis': 'Upload Report',
  'inventory': 'My Products',
  'settings': 'Settings'
};

  const cleanMessageText = (text: string) => {
    return text.replace(/\[NAVIGATE:\s*[a-zA-Z-]+\]/g, '').trim();
  };

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // If the stream is hanging, forcefully stop it before sending the next message
    if (isLoading && stop) {
      stop();
    }
    
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex flex-col h-[calc(100vh-140px)] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 overflow-hidden shadow-xs"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
        <button 
          onClick={() => onNavigate('agent-dashboard')}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-display font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-500" /> Ask My Agent
          </h2>
          <p className="text-[11px] text-slate-400">Powered by Qwen</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center">
              <Bot className="w-6 h-6 text-teal-500" />
            </div>
            <p className="text-sm">Hello! I'm your RoutineIQ agent. How can I help with your skincare routine today?</p>
          </div>
        ) : (
          messages.map(m => (
            <motion.div 
              key={m.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                m.role === 'user' ? 'bg-slate-100 dark:bg-slate-800' : 'bg-teal-100 dark:bg-teal-900/40 text-teal-600'
              }`}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              {(() => {
                const textContent = m.parts?.map(p => p.type === 'text' ? p.text : '').join('') || (m as any).content || (m as any).text || '';
                const navMatch = textContent.match(/\[NAVIGATE:\s*([a-zA-Z-]+)\]/);
                const navTarget = navMatch ? navMatch[1].trim() : null;

                return (
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-slate-800 text-white dark:bg-slate-700' 
                      : 'bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700/50'
                  }`}>
                    <div>
                      {m.parts?.map((part, i) => {
                        if (part.type === 'text') return <span key={i}>{cleanMessageText(part.text)}</span>;
                        if (part.type === 'reasoning') return <div key={i} className="text-slate-400 italic text-xs mb-2">{part.text}</div>;
                        return null;
                      }) || cleanMessageText((m as any).content || (m as any).text || '')}
                    </div>

                    {navTarget && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/50 dark:border-slate-850 flex items-center">
                        <button
                          onClick={() => onNavigate(navTarget as any)}
                          className="inline-flex items-center gap-1.5 bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100/50 dark:hover:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-[10px] font-bold py-1.5 px-3 rounded-lg border border-teal-200/40 dark:border-teal-800/30 cursor-pointer transition"
                        >
                          Go to {SCREEN_NAMES[navTarget] || navTarget} →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          ))
        )}
        {isLoading && (
          <motion.div className="flex gap-3 max-w-[85%]">
            <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-teal-100 dark:bg-teal-900/40 text-teal-600">
              <Bot className="w-4 h-4" />
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0.15s' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-5 py-3 bg-red-50/50 dark:bg-red-900/10 border-t border-red-100/50 dark:border-red-800/30 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 mt-0.5">
            <Bot className="w-4 h-4 text-red-500 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-800 dark:text-red-300">Oops, I'm having trouble connecting right now.</p>
            <p className="text-[13px] text-red-600/80 dark:text-red-400/80 mt-0.5">{error.message || 'Please try sending your message again in a moment.'}</p>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form onSubmit={onSubmit} className="relative flex items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your routine..."
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full pl-5 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-shadow dark:text-white"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 p-2 rounded-full bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
