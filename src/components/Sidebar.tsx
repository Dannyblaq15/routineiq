'use client';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Image from 'next/image';
import {
  LayoutDashboard,
  BookOpen,
  Lightbulb,
  TrendingUp,
  MessageSquare,
  FileUp,
  ShoppingBag,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon,
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

// ─── Nav config ───────────────────────────────────────────────────────────────

const AGENT_NAV = [
  { id: 'agent-dashboard' as ScreenType, label: 'Dashboard',      icon: LayoutDashboard },
  { id: 'memory-timeline' as ScreenType, label: 'My History',     icon: BookOpen },
  { id: 'agent-insights' as ScreenType,  label: 'Agent Insights', icon: Lightbulb },
  { id: 'progress'        as ScreenType, label: 'My Progress',    icon: TrendingUp },
  { id: 'chat'            as ScreenType, label: 'Ask My Agent',   icon: MessageSquare },
];

const TOOLS_NAV = [
  { id: 'analysis'  as ScreenType, label: 'Upload Report',  icon: FileUp },
  { id: 'inventory' as ScreenType, label: 'My Products',    icon: ShoppingBag },
  { id: 'settings'  as ScreenType, label: 'Settings',       icon: Settings },
];

// ─── NavItem ──────────────────────────────────────────────────────────────────

function NavItem({
  item,
  isActive,
  isCollapsed,
  onClick,
}: {
  item: { id: ScreenType; label: string; icon: React.ElementType };
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer group text-left
        ${isActive
          ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold border-l-4 border-teal-600 dark:border-teal-400'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
        }`}
      aria-current={isActive ? 'page' : undefined}
      title={isCollapsed ? item.label : undefined}
    >
      <Icon className={`w-4.5 h-4.5 shrink-0 transition-colors ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white'}`} style={{ width: '18px', height: '18px' }} />
      <span className={`text-[13px] whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'md:hidden' : 'opacity-100'}`}>
        {item.label}
      </span>
    </button>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ label, isCollapsed }: { label: string; isCollapsed: boolean }) {
  return (
    <p className={`px-3 pt-3 pb-1 text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ${isCollapsed ? 'text-center' : ''}`}>
      <span className={isCollapsed ? 'md:hidden' : ''}>{label}</span>
    </p>
  );
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

export default function Sidebar({
  currentScreen,
  onScreenChange,
  darkMode,
  onToggleDarkMode,
  fontSize,
  onChangeFontSize,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (screen: ScreenType) => {
    onScreenChange(screen);
    setMobileOpen(false);
  };

  return (
    <>
      {/* ── Mobile top bar ─────────────────────────────────────────────────── */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2" role="banner">
          <Image src="/icon-192.png" alt="RoutineIQ logo" width={28} height={28} className="rounded-lg" />
          <span className="font-display font-black text-lg text-teal-800 dark:text-teal-300 tracking-tight">RoutineIQ</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-500 dark:text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile backdrop ─────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar shell ───────────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 transform
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:relative
          ${isCollapsed ? 'md:w-[68px]' : 'md:w-60'}
          shrink-0`}
        aria-label="Main navigation"
      >
        {/* ── Logo header ─────────────────────────────────────────────────── */}
        <div className="px-4 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
            <Image
              src="/icon-192.png"
              alt="RoutineIQ logo"
              width={32}
              height={32}
              className="rounded-xl shrink-0"
              priority
            />
            <div className={`transition-all duration-300 min-w-0 ${isCollapsed ? 'md:w-0 md:opacity-0 md:overflow-hidden' : 'opacity-100'}`}>
              <h1 className="font-display font-black text-base text-teal-800 dark:text-teal-300 leading-none tracking-tight whitespace-nowrap">RoutineIQ</h1>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-0.5 whitespace-nowrap">AI Skincare Agent</p>
            </div>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition shrink-0"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* ── Navigation ──────────────────────────────────────────────────── */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto" aria-label="Main menu">

          {/* MemoryAgent */}
          <SectionLabel label="My Agent" isCollapsed={isCollapsed} />
          {AGENT_NAV.map(item => (
            <NavItem
              key={item.id}
              item={item}
              isActive={currentScreen === item.id}
              isCollapsed={isCollapsed}
              onClick={() => handleNav(item.id)}
            />
          ))}

          {/* Divider */}
          <div className="my-3 mx-1 h-px bg-slate-100 dark:bg-slate-800" />

          {/* Tools */}
          <SectionLabel label="Tools" isCollapsed={isCollapsed} />
          {TOOLS_NAV.map(item => (
            <NavItem
              key={item.id}
              item={item}
              isActive={currentScreen === item.id}
              isCollapsed={isCollapsed}
              onClick={() => handleNav(item.id)}
            />
          ))}
        </nav>

        {/* ── Bottom controls ──────────────────────────────────────────────── */}
        <div className={`p-3 border-t border-slate-100 dark:border-slate-800 space-y-2`}>

          {/* Font size */}
          {!isCollapsed && (
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 px-1 mb-1">Text size</p>
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg gap-1">
                {(['sm', 'md', 'lg'] as const).map(sz => (
                  <button
                    key={sz}
                    onClick={() => onChangeFontSize(sz)}
                    className={`flex-1 py-1 text-center text-[11px] font-bold rounded uppercase transition-all
                      ${fontSize === sz
                        ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-sm'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                    aria-label={`Set text size to ${sz}`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDarkMode}
            className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/40 transition text-xs font-medium
              ${isCollapsed ? 'justify-center' : ''}`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode
              ? <Sun className="w-4 h-4 text-yellow-500 shrink-0" />
              : <Moon className="w-4 h-4 text-teal-600 shrink-0" />
            }
            <span className={isCollapsed ? 'md:hidden' : ''}>{darkMode ? 'Light mode' : 'Dark mode'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
