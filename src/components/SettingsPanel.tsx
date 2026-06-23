'use client';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Bell, ShieldCheck, Save, Sun, Moon, KeyRound,
  User, Mail, Smartphone, RefreshCw,
} from 'lucide-react';

interface SettingsPanelProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onRestartTour: () => void;
  // kept for compat but no-ops
  fontSize?: 'sm' | 'md' | 'lg';
  onChangeFontSize?: (size: 'sm' | 'md' | 'lg') => void;
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`relative w-11 h-6 flex items-center rounded-full p-1 shrink-0 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900
        ${checked ? 'bg-teal-600' : 'bg-slate-200 dark:bg-slate-700'}`}
    >
      <span className={`block w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

export default function SettingsPanel({
  darkMode,
  onToggleDarkMode,
  onRestartTour,
}: SettingsPanelProps) {
  const [notifications, setNotifications] = useState({
    routineReminders: true,
    agentInsights: true,
    productAlerts: true,
    weeklyReport: false,
  });

  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof typeof notifications) => {
    setNotifications(p => ({ ...p, [key]: !p[key] }));
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6 pb-12"
    >
      {/* ── Appearance ─────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-xs p-5 space-y-4">
        <h2 className="font-display font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
          {darkMode ? <Moon className="w-4 h-4 text-teal-400" /> : <Sun className="w-4 h-4 text-yellow-500" />}
          Appearance
        </h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Dark mode</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Switch between light and dark themes</p>
          </div>
          <Toggle checked={darkMode} onChange={onToggleDarkMode} label="Toggle dark mode" />
        </div>
      </section>

      {/* ── Notifications ─────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-xs p-5 space-y-4">
        <h2 className="font-display font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-teal-500" />
          Notifications
        </h2>

        <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
          {[
            { key: 'routineReminders' as const, label: 'Routine reminders', desc: 'Daily nudge to complete your AM or PM steps' },
            { key: 'agentInsights'    as const, label: 'Agent insights',    desc: 'When your agent has a new recommendation for you' },
            { key: 'productAlerts'   as const, label: 'Product alerts',    desc: 'When a conflict is detected in your shelf' },
            { key: 'weeklyReport'    as const, label: 'Weekly summary',    desc: 'A short recap of your routine progress each Sunday' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between gap-4 pt-4 first:pt-0">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{desc}</p>
              </div>
              <Toggle checked={notifications[key]} onChange={() => toggle(key)} label={`Toggle ${label}`} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Profile ───────────────────────────────────────────────────────── */}
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-xs p-5 space-y-4">
        <h2 className="font-display font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-teal-500" />
          Your profile
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="settings-name" className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <User className="w-3 h-3" /> Name
            </label>
            <input
              id="settings-name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => { setName(e.target.value); setSaved(false); }}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-slate-300 dark:placeholder:text-slate-600"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="settings-email" className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Mail className="w-3 h-3" /> Email
            </label>
            <input
              id="settings-email"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setSaved(false); }}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-slate-300 dark:placeholder:text-slate-600"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Saved!
            </motion.span>
          )}
          {!saved && <span />}
          <button
            type="submit"
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" /> Save
          </button>
        </div>
      </form>

      {/* ── App ───────────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-xs p-5 space-y-4">
        <h2 className="font-display font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-teal-500" />
          App
        </h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Replay onboarding tour</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">See the getting-started guide again</p>
          </div>
          <button
            type="button"
            onClick={onRestartTour}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Replay
          </button>
        </div>
      </section>

      {/* ── Privacy note ──────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200/50 dark:border-teal-800/30">
        <KeyRound className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
        <p className="text-xs text-teal-700 dark:text-teal-300 leading-relaxed">
          Your data stays on your device. RoutineIQ never sells or shares your skincare history with third parties.
        </p>
      </div>
    </motion.div>
  );
}
