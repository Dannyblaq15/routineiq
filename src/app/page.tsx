'use client';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles, Sun, Moon, X } from 'lucide-react';

import Sidebar from '../components/Sidebar';
import ReportAnalysis from '../components/ReportAnalysis';
import InventoryManagement from '../components/InventoryManagement';
import SettingsPanel from '../components/SettingsPanel';
import AgentDashboard from '../components/AgentDashboard';
import MemoryTimeline from '../components/MemoryTimeline';
import AgentChat from '../components/AgentChat';
import OnboardingTour, { useOnboardingTour } from '../components/OnboardingTour';
import AgentInsightsScreen from '../components/AgentInsightsScreen';
import LoginScreen from '../components/LoginScreen';
import Landing from '../components/Landing';

import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

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

const TIMELINE_STEPS = [
  { id: 'analysis' as ScreenType, label: '1. Report Upload', desc: 'Scan doctor notes' },
  { id: 'inventory' as ScreenType, label: '2. My Products', desc: 'Manage your shelf' },
  { id: 'agent-dashboard' as ScreenType, label: '3. AI Dashboard', desc: 'Your active routines' },
  { id: 'memory-timeline' as ScreenType, label: '4. History Log', desc: 'Timeline of events' },
  { id: 'agent-insights' as ScreenType, label: '5. Agent Insights', desc: 'Deeper AI reviews' },
  { id: 'chat' as ScreenType, label: '6. Ask Agent', desc: 'Consult your LLM' },
];

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
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('landing');
  const [analyses, setAnalyses] = useState<PatientAnalysisType[]>(recentAnalysesList);
  const [inventory, setInventory] = useState<InventoryItem[]>(inventoryItemsList);
  const [modalType, setModalType] = useState<'privacy' | 'doc' | null>(null);

  useEffect(() => {
    // Setup global fetch interceptor to inject Firebase auth token
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input instanceof Request ? input.url : input.toString();
      if (url.startsWith('/api/')) {
        try {
          const token = await auth.currentUser?.getIdToken();
          if (token) {
            init = init || {};
            init.headers = {
              ...init.headers,
              Authorization: `Bearer ${token}`
            };
          }
        } catch (e) {
          console.error('Failed to get Firebase token', e);
        }
      }
      return originalFetch(input, init);
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setCurrentScreen(prev => (prev === 'landing' ? 'agent-dashboard' : prev));
        // Fetch user database memory to override mock data and provide fresh slate
        fetch('/api/memory')
          .then(res => res.json())
          .then(data => {
            if (data.inventory) {
              setInventory(data.inventory);
            } else {
              setInventory([]);
            }
            if (data.reports) {
              setAnalyses(data.reports);
            } else {
              setAnalyses([]);
            }
          })
          .catch(err => {
            console.error('Failed to load user memory:', err);
            setInventory([]);
            setAnalyses([]);
          });
      } else {
        setCurrentScreen('landing');
        setInventory(inventoryItemsList);
        setAnalyses(recentAnalysesList);
      }
      setAuthLoading(false);
    });

    return () => {
      unsubscribe();
      window.fetch = originalFetch; // Cleanup interceptor
    };
  }, []);

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
  const handleAddInventory = async (item: InventoryItem) => {
    setInventory(p => [item, ...p]);
    try {
      await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', item })
      });
    } catch (err) {
      console.error('Failed to sync added item to database:', err);
    }
  };

  const handleDeleteInventory = async (id: string) => {
    setInventory(p => p.filter(i => i.id !== id));
    try {
      await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', item: { id } })
      });
    } catch (err) {
      console.error('Failed to sync deleted item from database:', err);
    }
  };

  const meta = SCREEN_META[currentScreen];
  const isAgentScreen = AGENT_SCREENS.includes(currentScreen);

  if (authLoading) {
    return <div className="min-h-screen bg-[#fafafa] dark:bg-[#090d16] flex items-center justify-center text-teal-600">Loading RoutineIQ...</div>;
  }

  if (!user) {
    if (currentScreen === 'landing') {
      return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col">
          {/* Guest Navbar */}
          <header className="border-b border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-4 sticky top-0 z-50">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/icon-192.png"
                  alt="RoutineIQ logo"
                  width={32}
                  height={32}
                  className="rounded-xl"
                  priority
                />
                <div>
                  <h1 className="font-display font-black text-base text-teal-800 dark:text-teal-300 leading-none tracking-tight">
                    RoutineIQ
                  </h1>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-0.5">
                    AI Skincare Agent
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {darkMode ? <Sun className="w-4.5 h-4.5 text-yellow-400" /> : <Moon className="w-4.5 h-4.5 text-teal-500" />}
                </button>
                <button
                  onClick={() => setCurrentScreen('settings')}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl transition duration-200 cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 py-8 px-4 overflow-y-auto">
            <Landing onScreenChange={setCurrentScreen} />
          </main>

          <footer className="py-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/icon-192.png"
                  alt="RoutineIQ"
                  width={22}
                  height={22}
                  className="rounded-lg opacity-60 dark:opacity-40"
                />
                <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  © 2026 RoutineIQ · Powered by Qwen AI on 
                  <a 
                    href="https://www.alibabacloud.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition flex items-center"
                  >
                    Alibaba Cloud
                  </a>
                </p>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500">
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-full font-medium text-[10px]">
                  Not medical advice
                </span>
                <button
                  onClick={() => setModalType('doc')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition font-medium cursor-pointer"
                >
                  Documentation
                </button>
                <button
                  onClick={() => setModalType('privacy')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition font-medium cursor-pointer"
                >
                  Privacy Policy
                </button>
              </div>
            </div>
          </footer>
        </div>
      );
    }
    return <LoginScreen onBackToLanding={() => setCurrentScreen('landing')} />;
  }

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

              {currentScreen === 'landing' && (
                <Landing onScreenChange={setCurrentScreen} />
              )}

              {currentScreen === 'agent-dashboard' && (
                <AgentDashboard onScreenChange={setCurrentScreen} />
              )}

              {currentScreen === 'memory-timeline' && (
                <MemoryTimeline />
              )}

              {currentScreen === 'analysis' && (
                <ReportAnalysis onAddAnalysis={handleAddAnalysis} onNavigate={setCurrentScreen} />
              )}

              {currentScreen === 'inventory' && (
                <InventoryManagement
                  items={inventory}
                  onAddItem={handleAddInventory}
                  onDeleteItem={handleDeleteInventory}
                  onNavigate={setCurrentScreen}
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
              <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                © 2026 RoutineIQ · Powered by Qwen AI on 
                <a 
                  href="https://www.alibabacloud.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition flex items-center"
                >
                  Alibaba Cloud
                </a>
              </p>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500">
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-full font-medium text-[10px]">
                Not medical advice
              </span>
              <button
                onClick={() => setModalType('doc')}
                className="hover:text-teal-600 dark:hover:text-teal-400 transition font-medium cursor-pointer"
              >
                Documentation
              </button>
              <button
                onClick={() => setModalType('privacy')}
                className="hover:text-teal-600 dark:hover:text-teal-400 transition font-medium cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setCurrentScreen('settings')}
                className="hover:text-teal-600 dark:hover:text-teal-400 transition font-medium cursor-pointer"
              >
                Settings
              </button>
            </div>
          </footer>

        </main>
      </div>

      {/* ── Privacy & Doc Modals ─────────────────────────────────────────── */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalType(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 max-h-[85vh] overflow-y-auto z-10 space-y-6 text-slate-800 dark:text-slate-200"
            >
              <button
                onClick={() => setModalType(null)}
                className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {modalType === 'privacy' ? (
                <>
                  <div className="space-y-1">
                    <h3 className="font-display font-black text-xl md:text-2xl text-slate-900 dark:text-white">Privacy & Safety Commitment</h3>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">How RoutineIQ protects and manages your active diagnostics.</p>
                  </div>
                  <div className="space-y-4 text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    <p>
                      <strong>1. Clinical Data Isolation</strong><br />
                      All dermatological diagnostic uploads, lab scripts, and routine timelines are stored securely in isolated private VPC databases on Alibaba Cloud ApsaraDB RDS, unreachable by any public internet connections.
                    </p>
                    <p>
                      <strong>2. User Identity Protection</strong><br />
                      Authentication operations and account logins are secured via industry-standard Firebase Authentication protocols. Session tokens are encrypted and checked before accessing any private database APIs.
                    </p>
                    <p>
                      <strong>3. Private AI Inferences</strong><br />
                      Your chats and product vision/OCR operations are queried directly through Alibaba Cloud Model Studio API gateways under strict tenant-level isolation. None of your uploaded files or chat scripts are shared or used to train public LLM models.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <h3 className="font-display font-black text-xl md:text-2xl text-slate-900 dark:text-white">RoutineIQ System Documentation</h3>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">Autonomous Copilot Architecture and memory engine designs.</p>
                  </div>
                  <div className="space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    <p>
                      <strong>1. Internal Core Routing Flow:</strong><br />
                      <code>User Browser (React UI)</code> ➔ <code>API Router Gateway</code> ➔ <code>Prisma ORM (ApsaraDB RDS MySQL)</code> &amp; <code>Alibaba Cloud Model Studio (Qwen Models)</code>.
                    </p>
                    <p>
                      <strong>2. Persistent Memory Loop:</strong><br />
                      All product scans, routine check-ins, and active preference modifications are compiled as structured database episodes (`MemoryEpisode` schema) to ensure the AI learns your preferences across execution sessions.
                    </p>
                    <p>
                      <strong>3. Vision &amp; OCR Engine:</strong><br />
                      RoutineIQ utilizes the workspace-specific <code>qwen3.5-ocr</code> multi-modal parser to read active ingredients, categories, and safety warning matrices directly from uploaded label images.
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
