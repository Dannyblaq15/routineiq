'use client';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Sidebar from '../components/Sidebar';
import ReportAnalysis from '../components/ReportAnalysis';
import InventoryManagement from '../components/InventoryManagement';
import SettingsPanel from '../components/SettingsPanel';
import AgentDashboard from '../components/AgentDashboard';
import MemoryTimeline from '../components/MemoryTimeline';

import { ScreenType, PatientAnalysis as PatientAnalysisType, InventoryItem } from '../types';
import { recentAnalysesList, inventoryItemsList } from '../data';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

// ─── Screen title map ─────────────────────────────────────────────────────────

const SCREEN_TITLES: Partial<Record<ScreenType, { title: string; subtitle: string }>> = {
  'agent-dashboard': { title: 'Dashboard',        subtitle: '✦ Your agent is active' },
  'memory-timeline': { title: 'My History',        subtitle: 'Everything your agent remembers' },
  'agent-insights':  { title: 'Agent Insights',    subtitle: 'Autonomous decisions this week' },
  'progress':        { title: 'My Progress',       subtitle: 'Adherence & skin improvement over time' },
  'chat':            { title: 'Ask My Agent',      subtitle: 'Ask anything — answered from your history' },
  'analysis':        { title: 'Upload Report',     subtitle: 'Add a dermatologist report to your memory' },
  'inventory':       { title: 'My Products',       subtitle: 'Everything on your skincare shelf' },
  'settings':        { title: 'Settings',          subtitle: 'Preferences and accessibility' },
};

// ─── Placeholder for screens coming soon ─────────────────────────────────────

function ComingSoon({ screen, onBack }: { screen: ScreenType; onBack: () => void }) {
  const info = SCREEN_TITLES[screen];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-28 gap-5 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center">
        <Sparkles className="w-7 h-7 text-teal-500" />
      </div>
      <div>
        <h2 className="font-display font-black text-xl text-slate-800 dark:text-white">{info?.title}</h2>
        <p className="text-sm text-slate-400 mt-1 max-w-xs">{info?.subtitle}</p>
      </div>
      <p className="text-xs text-slate-400 italic">This screen is coming soon — building now ✦</p>
      <button
        onClick={onBack}
        className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
      >
        ← Back to Dashboard
      </button>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Page() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('agent-dashboard');
  const [analyses, setAnalyses] = useState<PatientAnalysisType[]>(recentAnalysesList);
  const [inventory, setInventory] = useState<InventoryItem[]>(inventoryItemsList);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('routineiq-dark-mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('routineiq-font-size') as 'sm' | 'md' | 'lg') || 'md';
    }
    return 'md';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    darkMode ? root.classList.add('dark') : root.classList.remove('dark');
    localStorage.setItem('routineiq-dark-mode', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('routineiq-font-size', fontSize);
  }, [fontSize]);

  const handleAddAnalysis = (item: PatientAnalysisType) => setAnalyses(prev => [item, ...prev]);
  const handleAddInventory = (item: InventoryItem) => setInventory(prev => [item, ...prev]);
  const handleDeleteInventory = (id: string) => setInventory(prev => prev.filter(i => i.id !== id));

  const fontClass = { sm: 'text-xs md:text-sm', md: 'text-sm md:text-base', lg: 'text-base md:text-lg' }[fontSize];
  const screenMeta = SCREEN_TITLES[currentScreen];
  const isAgentScreen = ['agent-dashboard', 'memory-timeline', 'agent-insights', 'progress', 'chat'].includes(currentScreen);

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-200 ${fontClass}`}>

      <Sidebar
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(d => !d)}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
      />

      <main className="flex-1 min-w-0 flex flex-col py-6 px-4 md:px-8 max-w-4xl mx-auto w-full">

        {/* ── Page header ──────────────────────────────────────────────────── */}
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-black text-xl tracking-tight text-slate-900 dark:text-white">
              {screenMeta?.title ?? 'RoutineIQ'}
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {screenMeta?.subtitle ?? 'Your AI skincare agent'}
            </p>
          </div>

          {/* Agent status badge */}
          {isAgentScreen && (
            <div className="flex items-center gap-2 bg-teal-50 dark:bg-teal-950/20 px-3.5 py-1.5 rounded-full border border-teal-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 tracking-wider uppercase">Agent active</span>
            </div>
          )}
        </header>

        {/* ── Screen content ────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <div key={currentScreen} className="relative flex-1">

            {currentScreen === 'agent-dashboard' && (
              <AgentDashboard onScreenChange={setCurrentScreen} />
            )}

            {currentScreen === 'memory-timeline' && (
              <MemoryTimeline />
            )}

            {currentScreen === 'analysis' && (
              <ReportAnalysis onAddAnalysis={handleAddAnalysis} />
            )}

            {currentScreen === 'inventory' && (
              <InventoryManagement
                items={inventory}
                onAddItem={handleAddInventory}
                onDeleteItem={handleDeleteInventory}
              />
            )}

            {currentScreen === 'settings' && (
              <SettingsPanel
                fontSize={fontSize}
                onChangeFontSize={setFontSize}
                darkMode={darkMode}
                onToggleDarkMode={() => setDarkMode(d => !d)}
              />
            )}

            {/* Coming soon: agent-insights, progress, chat */}
            {(currentScreen === 'agent-insights' || currentScreen === 'progress' || currentScreen === 'chat') && (
              <ComingSoon screen={currentScreen} onBack={() => setCurrentScreen('agent-dashboard')} />
            )}
          </div>
        </AnimatePresence>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <footer className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image src="/icon-192.png" alt="RoutineIQ" width={24} height={24} className="rounded-lg opacity-70" />
            <p className="text-[11px] text-slate-400">
              © 2026 RoutineIQ · Powered by Qwen AI
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full font-medium">Not medical advice</span>
            <button
              onClick={() => setCurrentScreen('settings')}
              className="hover:text-teal-600 dark:hover:text-teal-400 transition font-medium"
            >
              Settings
            </button>
          </div>
        </footer>

      </main>
    </div>
  );
}
