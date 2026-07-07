'use client';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

import Sidebar from '../components/Sidebar';
import ReportAnalysis from '../components/ReportAnalysis';
import InventoryManagement from '../components/InventoryManagement';
import SettingsPanel from '../components/SettingsPanel';
import AgentDashboard from '../components/AgentDashboard';
import MemoryTimeline from '../components/MemoryTimeline';
import AgentChat from '../components/AgentChat';
import OnboardingTour, { useOnboardingTour } from '../components/OnboardingTour';
import AgentInsightsScreen from '../components/AgentInsightsScreen';

import { ScreenType, PatientAnalysis as PatientAnalysisType, InventoryItem } from '../types';
import { recentAnalysesList, inventoryItemsList } from '../data';

// ─── Screen metadata ──────────────────────────────────────────────────────────

const SCREEN_META: Partial<Record<ScreenType, { title: string; subtitle: string }>> = {
  'agent-dashboard': { title: 'Dashboard',       subtitle: '✦ Your agent is active' },
  'memory-timeline': { title: 'My History',       subtitle: 'Everything your agent remembers' },
  'agent-insights':  { title: 'Agent Insights',   subtitle: 'Autonomous decisions this week' },
  'chat':            { title: 'Ask My Agent',     subtitle: 'Ask anything — answered from your history' },
  'analysis':        { title: 'Upload Report',    subtitle: 'Add a dermatologist report to your memory' },
  'inventory':       { title: 'My Products',      subtitle: 'Everything on your skincare shelf' },
  'settings':        { title: 'Settings',         subtitle: 'Your preferences' },
};

const AGENT_SCREENS: ScreenType[] = ['agent-dashboard', 'memory-timeline', 'agent-insights', 'chat'];

// ─── Coming-soon placeholder ──────────────────────────────────────────────────

function ComingSoon({ screen, onBack }: { screen: ScreenType; onBack: () => void }) {
  const meta = SCREEN_META[screen];
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
        <h2 className="font-display font-black text-xl text-slate-800 dark:text-white">{meta?.title}</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-xs">{meta?.subtitle}</p>
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 italic">This screen is coming soon ✦</p>
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

  // Dark mode
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('routineiq-dark-mode');
      if (stored === 'true') {
        setDarkMode(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const root = document.documentElement;
    darkMode ? root.classList.add('dark') : root.classList.remove('dark');
    localStorage.setItem('routineiq-dark-mode', String(darkMode));
  }, [darkMode, isMounted]);

  // Onboarding tour
  const { show: showTour, complete: completeTour, restart: restartTour } = useOnboardingTour();

  const handleAddAnalysis = (item: PatientAnalysisType) => setAnalyses(p => [item, ...p]);
  const handleAddInventory = (item: InventoryItem) => setInventory(p => [item, ...p]);
  const handleDeleteInventory = (id: string) => setInventory(p => p.filter(i => i.id !== id));

  const meta = SCREEN_META[currentScreen];
  const isAgentScreen = AGENT_SCREENS.includes(currentScreen);

  return (
    <>
      {/* ── Onboarding tour overlay ───────────────────────────────────────── */}
      <AnimatePresence>
        {showTour && <OnboardingTour onComplete={completeTour} />}
      </AnimatePresence>

      <div className="min-h-screen bg-[#fafafa] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row">

        <Sidebar
          currentScreen={currentScreen}
          onScreenChange={setCurrentScreen}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(d => !d)}
        />

        <main className="flex-1 min-w-0 flex flex-col py-6 px-4 lg:px-10 overflow-y-auto">

          {/* ── Page header ────────────────────────────────────────────────── */}
          <header className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="font-display font-black text-xl tracking-tight text-slate-900 dark:text-white">
                {meta?.title ?? 'RoutineIQ'}
              </h1>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                {meta?.subtitle ?? 'Your AI skincare agent'}
              </p>
            </div>

            {isAgentScreen && (
              <div className="flex items-center gap-2 bg-teal-50 dark:bg-teal-950/30 px-3.5 py-1.5 rounded-full border border-teal-200 dark:border-teal-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 tracking-wider uppercase">
                  Agent active
                </span>
              </div>
            )}
          </header>

          {/* ── Screen content ──────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            <div key={currentScreen} className="flex-1">

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
                  darkMode={darkMode}
                  onToggleDarkMode={() => setDarkMode(d => !d)}
                  onRestartTour={restartTour}
                />
              )}

              {currentScreen === 'chat' && (
                <AgentChat onNavigate={setCurrentScreen} />
              )}

              {(currentScreen === 'agent-insights') && (
                <AgentInsightsScreen onBack={() => setCurrentScreen('agent-dashboard')} />
              )}
            </div>
          </AnimatePresence>

          {/* ── Footer ─────────────────────────────────────────────────────── */}
          <footer className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Image
                src="/icon-192.png"
                alt="RoutineIQ"
                width={22}
                height={22}
                className="rounded-lg opacity-60 dark:opacity-40"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                © 2026 RoutineIQ · Powered by Qwen AI
              </p>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500">
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-full font-medium text-[10px]">
                Not medical advice
              </span>
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
    </>
  );
}
