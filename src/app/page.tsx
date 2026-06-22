/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import HomeOverview from '../components/HomeOverview';
import ReportAnalysis from '../components/ReportAnalysis';
import InventoryManagement from '../components/InventoryManagement';
import IntelligenceEngine from '../components/IntelligenceEngine';
import PatientAnalytics from '../components/PatientAnalytics';
import Landing from '../components/Landing';
import SettingsPanel from '../components/SettingsPanel';

import { ScreenType, PatientAnalysis as PatientAnalysisType, InventoryItem } from '../types';
import { recentAnalysesList, inventoryItemsList } from '../data';
import { AnimatePresence } from 'motion/react';
import { Brain } from 'lucide-react';

export default function Page() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('landing');
  const [analyses, setAnalyses] = useState<PatientAnalysisType[]>(recentAnalysesList);
  const [inventory, setInventory] = useState<InventoryItem[]>(inventoryItemsList);
  
  // Accessibility & Pref States
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Standard system preference matching
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('routineiq-dark-mode');
      if (saved !== null) {
        return saved === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('routineiq-font-size');
      return (saved as 'sm' | 'md' | 'lg') || 'md';
    }
    return 'md';
  });

  // Toggle Dark Mode Class
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('routineiq-dark-mode', String(darkMode));
  }, [darkMode]);

  // Save Font Size multiplier
  useEffect(() => {
    localStorage.setItem('routineiq-font-size', fontSize);
  }, [fontSize]);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleAddAnalysis = (newAnalysis: PatientAnalysisType) => {
    setAnalyses((prev) => [newAnalysis, ...prev]);
  };

  const handleOpenAnalysis = (id: string) => {
    // Jump straight to analysis tab to review details
    setCurrentScreen('analysis');
  };

  const handleAddInventory = (newItem: InventoryItem) => {
    setInventory((prev) => [newItem, ...prev]);
  };

  const handleDeleteInventory = (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
  };

  // Switch display sizing text-scaling
  const fontClassMultiplier = {
    sm: 'text-xs md:text-sm',
    md: 'text-sm md:text-base',
    lg: 'text-base md:text-lg'
  }[fontSize];

  return (
    <div className={`min-h-screen bg-[#fafbfc] dark:bg-[#090d16] text-[#1e293b] dark:text-[#f8fafc] flex flex-col md:flex-row transition-colors duration-200 ${fontClassMultiplier}`}>
      
      {/* Retractable responsive Sidebar */}
      <Sidebar
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
      />

      {/* Main Panel Viewport */}
      <main className="flex-1 min-w-0 flex flex-col justify-between py-6 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div>
          
          {/* Actionable Screen Headings & Navigation */}
          <header className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 rounded-xl">
                <Brain className="w-5 h-5" />
              </span>
              <div>
                <h1 className="font-display font-black text-xl tracking-tight text-slate-900 dark:text-white">
                  RoutineIQ Workspace
                </h1>
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  Secure Local Instance
                </p>
              </div>
            </div>

            {/* Quick status pill */}
            <div className="flex items-center gap-2 bg-teal-50 dark:bg-teal-950/20 px-3.5 py-1.5 rounded-full border border-teal-500/10">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span className="text-[10px] font-bold text-teal-800 dark:text-teal-400 tracking-wider uppercase">Active Cohort Guarded</span>
            </div>
          </header>

          {/* Page screen routing frame */}
          <AnimatePresence mode="wait">
            <div key={currentScreen} className="relative">
              {currentScreen === 'landing' && (
                <Landing onScreenChange={setCurrentScreen} />
              )}
              {currentScreen === 'home' && (
                <HomeOverview 
                  onScreenChange={setCurrentScreen} 
                  analyses={analyses} 
                  onOpenAnalysis={handleOpenAnalysis} 
                />
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
              {currentScreen === 'intelligence' && (
                <IntelligenceEngine />
              )}
              {currentScreen === 'analytics' && (
                <PatientAnalytics />
              )}
              {currentScreen === 'settings' && (
                <SettingsPanel 
                  fontSize={fontSize} 
                  onChangeFontSize={setFontSize} 
                  darkMode={darkMode} 
                  onToggleDarkMode={handleToggleDarkMode} 
                />
              )}
            </div>
          </AnimatePresence>

        </div>

        {/* Global Access Footprint */}
        <footer className="pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© 2026 RoutineIQ Clinical Systems. Built & hosted locally.</p>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentScreen('settings')} 
              className="hover:text-teal-700 dark:hover:text-teal-400 transition"
              aria-label="Direct link to UI/UX settings"
            >
              Auditing Controls
            </button>
            <span>•</span>
            <button 
              onClick={() => setCurrentScreen('landing')} 
              className="hover:text-teal-700 dark:hover:text-teal-400 transition"
              aria-label="View product features page"
            >
              Dermatologist Product Info
            </button>
          </div>
        </footer>

      </main>

    </div>
  );
}
