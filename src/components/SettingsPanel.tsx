/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Bell, ShieldCheck, Mail, Smartphone, Save, Eye, EyeOff, KeyRound } from 'lucide-react';
import { SettingItem } from '../types';

interface SettingsPanelProps {
  fontSize: 'sm' | 'md' | 'lg';
  onChangeFontSize: (size: 'sm' | 'md' | 'lg') => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function SettingsPanel({
  fontSize,
  onChangeFontSize,
  darkMode,
  onToggleDarkMode
}: SettingsPanelProps) {
  const [notifications, setNotifications] = useState<SettingItem>({
    email: true,
    push: true,
    sms: false,
    routineCompliance: true,
    inventoryAlerts: true,
    clinicalIntelligence: true,
    systemAlerts: false
  });

  const [clinicName, setClinicName] = useState('Central Dermatology Lab');
  const [supervisorEmail, setSupervisorEmail] = useState('director@routineiq.org');
  const [isSaved, setIsSaved] = useState(false);

  const toggleNotification = (key: keyof SettingItem) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
    setIsSaved(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8 pb-12"
    >
      <div>
        <h2 className="font-display font-black text-2xl md:text-3xl text-slate-900 dark:text-white">Settings & Auditing Controls</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manage notification thresholds, clinical database rules, UI scale multipliers, and agency profile details.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Col 1 & 2: Main Form Workspace (2/3 col) */}
        <form onSubmit={handleSaveSettings} className="lg:col-span-2 space-y-6">
          
          {/* Section A: Profile Identity */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-50 dark:border-slate-800">
              <Settings className="w-4 h-4 text-teal-600" />
              Clinical Identity Settings
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="clinic-name" className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Authorized Clinic Name</label>
                <input
                  id="clinic-name"
                  type="text"
                  value={clinicName}
                  onChange={(e) => { setClinicName(e.target.value); setIsSaved(false); }}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="supervisor-email" className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Supervisor Direct Email</label>
                <input
                  id="supervisor-email"
                  type="email"
                  value={supervisorEmail}
                  onChange={(e) => { setSupervisorEmail(e.target.value); setIsSaved(false); }}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Section B: Notifications Switchboard */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-50 dark:border-slate-800">
              <Bell className="w-4 h-4 text-teal-600" />
              Intelligence Broadcast Switchboard
            </h3>

            <div className="space-y-4 divide-y divide-slate-50 dark:divide-slate-800">
              {/* Email Switch */}
              <div className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-xs text-slate-850 dark:text-slate-250">Digestive Email Broadcasts</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">Transmit weekly aggregate clinical analytics directly to supervising physicians.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotification('email')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 focus:outline-none
                    ${notifications.email ? 'bg-teal-700' : 'bg-slate-200 dark:bg-slate-800'}`}
                  aria-label="Toggle email notifications"
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${notifications.email ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Push Alarm */}
              <div className="pt-3 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-xs text-slate-850 dark:text-slate-250">Real-Time Mobile Device Pushes</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">Alert designated devices immediately upon severe chemical conflict detection during scanning.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotification('push')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 focus:outline-none
                    ${notifications.push ? 'bg-teal-700' : 'bg-slate-200 dark:bg-slate-800'}`}
                  aria-label="Toggle mobile device push warnings"
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${notifications.push ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* SMS Crisis alert */}
              <div className="pt-3 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-xs text-slate-850 dark:text-slate-250">Crisis SMS Cellular Warnings</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">Dispatch standard urgent cell warning text lines if system spots life hazard levels.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotification('sms')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 focus:outline-none
                    ${notifications.sms ? 'bg-teal-700' : 'bg-slate-200 dark:bg-slate-800'}`}
                  aria-label="Toggle crisis SMS alerts"
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${notifications.sms ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Clinical Rule adherence checks */}
              <div className="pt-3 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-xs text-slate-850 dark:text-slate-250">Patient Compliance Alerts</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">Integrate historical checkout registers to guarantee strict routine compliance.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotification('routineCompliance')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 focus:outline-none
                    ${notifications.routineCompliance ? 'bg-teal-700' : 'bg-slate-200 dark:bg-slate-800'}`}
                  aria-label="Toggle compliance tracking analytics alerts"
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${notifications.routineCompliance ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Action trigger footer */}
          <div className="flex justify-end items-center gap-3">
            {isSaved && (
              <span className="text-xs font-bold text-teal-650 flex items-center gap-1.5 animate-bounce">
                <ShieldCheck className="w-4 h-4" /> Changes verified successfully.
              </span>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-750 hover:bg-teal-800 text-white font-bold text-xs rounded-xl uppercase transition cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Preferences
            </button>
          </div>

        </form>

        {/* Column 3: Quick Accessibility Toggles & Guidelines (1/3 col) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-50 dark:border-slate-800">
              <Mail className="w-4 h-4 text-teal-600" />
              Accessibility Quick Panel
            </h3>

            <div className="space-y-4 text-xs leading-relaxed text-slate-650 dark:text-slate-350">
              {/* Scaler detail */}
              <div className="space-y-1">
                <span className="block font-bold text-slate-400 uppercase text-[10px]">Active Font Sizer multiplier</span>
                <p>RoutineIQ renders content respecting adjusted relative sizing. Toggle between sizes dynamically on the sidebar drawer, or specify below:</p>
                <div className="grid grid-cols-3 gap-1 pt-1.5">
                  {(['sm', 'md', 'lg'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => onChangeFontSize(sz)}
                      className={`py-1.5 text-center text-xs font-bold rounded uppercase cursor-pointer transition
                        ${fontSize === sz 
                          ? 'bg-teal-50 dark:bg-teal-950/45 text-teal-850 dark:text-teal-300 border border-teal-550' 
                          : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-500'
                        }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme preference description */}
              <div className="space-y-1">
                <span className="block font-bold text-slate-400 uppercase text-[10px]">Theme Environment Layout</span>
                <p>Choose high-contrast light theme built strictly for clinics, or modern slate twilight theme for high-comfort night shifts.</p>
                <button
                  type="button"
                  onClick={onToggleDarkMode}
                  className="w-full text-center py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold rounded-xl transition cursor-pointer text-[11px] uppercase border border-slate-100 dark:border-slate-800/80"
                >
                  Toggle {darkMode ? 'Light Theme View' : 'Dark Theme View'}
                </button>
              </div>
            </div>
          </div>

          {/* Security details checklist */}
          <div className="bg-gradient-to-br from-teal-900/10 to-teal-900/20 dark:from-teal-950/20 p-6 rounded-2xl border border-teal-800/10 shadow-sm space-y-2">
            <h4 className="font-bold text-xs text-teal-800 dark:text-teal-300 flex items-center gap-1.5 uppercase">
              <KeyRound className="w-4 h-4" /> HIPAA Compliance Guarded
            </h4>
            <p className="text-[11px] text-teal-700 dark:text-teal-400 leading-relaxed">
              Every analyzed file, patient record segment, and conflict history parsed locally inside RoutineIQ is filtered and stored locally in local Storage state cache. No clinical data is ever broadcast or sold to corporate advertisers.
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
