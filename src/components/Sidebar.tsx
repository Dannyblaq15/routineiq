/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Home, 
  Microscope, 
  Package, 
  Brain, 
  BarChart2, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Sparkles,
  Type,
  LayoutDashboard,
  BookOpen,
  Lightbulb,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';
import { ScreenType } from '../types';

interface SidebarProps {
  currentScreen: ScreenType;
  onScreenChange: (screen: ScreenType) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  fontSize: 'sm' | 'md' | 'lg';
  onChangeFontSize: (size: 'sm' | 'md' | 'lg') => void;
}

export default function Sidebar({
  currentScreen,
  onScreenChange,
  darkMode,
  onToggleDarkMode,
  fontSize,
  onChangeFontSize
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const agentItems = [
    { id: 'agent-dashboard' as ScreenType, label: 'Agent Dashboard', icon: LayoutDashboard },
    { id: 'memory-timeline' as ScreenType, label: 'Memory Timeline', icon: BookOpen },
    { id: 'agent-insights' as ScreenType, label: 'Agent Insights', icon: Lightbulb },
    { id: 'progress' as ScreenType, label: 'Progress', icon: TrendingUp },
    { id: 'chat' as ScreenType, label: 'Chat with Agent', icon: MessageSquare },
  ];

  const legacyItems = [
    { id: 'landing' as ScreenType, label: 'RoutineIQ Info', icon: Sparkles },
    { id: 'home' as ScreenType, label: 'Home Overview', icon: Home },
    { id: 'analysis' as ScreenType, label: 'Report Analysis', icon: Microscope },
    { id: 'inventory' as ScreenType, label: 'Inventory', icon: Package },
    { id: 'intelligence' as ScreenType, label: 'Intelligence', icon: Brain },
    { id: 'analytics' as ScreenType, label: 'Analytics', icon: BarChart2 },
    { id: 'settings' as ScreenType, label: 'Settings', icon: Settings },
  ];

  const handleNav = (screen: ScreenType) => {
    onScreenChange(screen);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Burger Header */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2" role="banner">
          <Brain className="w-6 h-6 text-teal-700 dark:text-teal-400" />
          <span className="font-display font-black text-lg text-teal-800 dark:text-teal-300">RoutineIQ</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-600 dark:text-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label={mobileOpen ? "Close main navigation menu" : "Open main navigation menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation Shell (Desktop retractable & Mobile adaptive) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 transform 
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:relative 
          ${isCollapsed ? 'md:w-20' : 'md:w-64'} 
          shrink-0`}
        aria-label="Sidebar Navigation"
      >
        {/* Sidebar Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2 overflow-hidden">
            <Brain className="w-8 h-8 text-teal-700 dark:text-teal-400 shrink-0" />
            <div className={`transition-all duration-300 ${isCollapsed ? 'md:opacity-0 md:w-0' : 'opacity-100 w-auto'}`}>
              <h1 className="font-display font-extrabold text-xl text-teal-800 dark:text-teal-300 tracking-tight">RoutineIQ</h1>
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 max-w-[120px] dark:text-slate-400">Clinical Intel</p>
            </div>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 cursor-pointer"
            aria-label={isCollapsed ? "Expand sidebar navigation menu" : "Collapse sidebar navigation menu"}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Main menu">

          {/* MemoryAgent section */}
          <div className={`text-[9px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-500 px-4 pb-1 pt-1 flex items-center gap-1.5 ${isCollapsed ? 'justify-center' : ''}`}>
            <Sparkles className="w-3 h-3" />
            <span className={isCollapsed ? 'md:hidden' : 'inline'}>MemoryAgent</span>
          </div>

          {agentItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer group text-left
                  ${isActive 
                    ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold border-l-4 border-teal-700 dark:border-teal-400 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                aria-current={isActive ? 'page' : undefined}
                title={isCollapsed ? item.label : undefined}
              >
                <IconComponent className={`w-5 h-5 shrink-0 ${isActive ? 'text-teal-700 dark:text-teal-400' : 'text-slate-500 group-hover:text-slate-800 dark:group-hover:text-white'}`} />
                <span className={`text-[13px] transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'md:hidden md:opacity-0' : 'opacity-100'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Divider */}
          <div className="my-2 mx-3 h-px bg-slate-200 dark:bg-slate-800" />

          {/* Legacy section */}
          <div className={`text-[9px] font-black uppercase tracking-widest text-slate-400 px-4 pb-1 pt-1 ${isCollapsed ? 'text-center' : ''}`}>
            <span className={isCollapsed ? 'md:hidden' : 'inline'}>Classic</span>
          </div>

          {legacyItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer group text-left
                  ${isActive 
                    ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold border-l-4 border-teal-700 dark:border-teal-400 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                aria-current={isActive ? 'page' : undefined}
                title={isCollapsed ? item.label : undefined}
              >
                <IconComponent className={`w-5 h-5 shrink-0 ${isActive ? 'text-teal-700 dark:text-teal-400' : 'text-slate-500 group-hover:text-slate-800 dark:group-hover:text-white'}`} />
                <span className={`text-[13px] transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'md:hidden md:opacity-0' : 'opacity-100'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Global Settings Block (Accessibility / Preferences) */}
        <div className={`p-4 border-t border-slate-100 dark:border-slate-800/80 space-y-4 ${isCollapsed ? "items-center" : ""}`}>
          
          {/* Adjustable Font Size Trigger */}
          <div className="space-y-1.5">
            <div className={`flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs px-2 ${isCollapsed ? 'justify-center' : ''}`}>
              <Type className="w-4 h-4 text-slate-400" />
              <span className={`font-medium ${isCollapsed ? 'md:hidden' : 'inline'}`}>Text Scale</span>
            </div>
            
            <div className={`flex items-center bg-slate-50 dark:bg-slate-800/50 p-1 rounded-lg gap-1 ${isCollapsed ? 'flex-col md:w-10 mx-auto' : 'flex-row'}`}>
              {(['sm', 'md', 'lg'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => onChangeFontSize(sz)}
                  className={`flex-1 py-1 text-center text-xs font-semibold rounded uppercase cursor-pointer transition-all duration-200
                    ${fontSize === sz 
                      ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-xs ring-1 ring-black/5 dark:ring-white/10' 
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  aria-label={`Adjust text size multiplier to ${sz === 'sm' ? '14px' : sz === 'md' ? '16px' : '18px'}`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Dark Mode Switcher */}
          <div className="space-y-1.5">
            <button
              onClick={onToggleDarkMode}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors
                ${isCollapsed ? 'justify-center md:p-2' : ''}`}
              aria-label={darkMode ? 'Switch applet view theme to Light Mode' : 'Switch applet view theme to Dark Mode'}
            >
              <div className="flex items-center gap-2.5">
                {darkMode ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-teal-700" />}
                <span className={`text-xs font-medium ${isCollapsed ? 'md:hidden' : 'inline'}`}>
                  {darkMode ? 'Light Theme' : 'Dark Theme'}
                </span>
              </div>
            </button>
          </div>

          {/* Enterprise CTA button inside navigation drawer */}
          <div className="pt-2">
            <button 
              onClick={() => onScreenChange('landing')}
              className={`bg-teal-700 hover:bg-teal-800 active:scale-95 text-white font-medium text-xs rounded-xl transition-all shadow-xs cursor-pointer text-center w-full block
                ${isCollapsed ? 'p-2' : 'py-2.5 px-3'}`}
            >
              <span className={isCollapsed ? 'md:hidden' : 'inline'}>Upgrade to Clinical</span>
              <span className={`font-black ${isCollapsed ? 'inline' : 'hidden md:inline ml-1'}`}>+</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
