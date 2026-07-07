'use client';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, Brain, Sun, Moon, CheckCircle2, Clock,
  ChevronRight, Zap, AlertTriangle, Bell, BarChart3,
  ThumbsUp, ThumbsDown, MessageSquare, TrendingUp,
  ShieldCheck, DollarSign, Layers,
} from 'lucide-react';
import { ScreenType, RoutineStep, RoutineScore, AgentDecision } from '../types';

interface AgentDashboardProps {
  onScreenChange: (screen: ScreenType) => void;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const AGENT_STATS = {
  products: 14,
  reports: 3,
  weeksHistory: 6,
  lastUpdated: '2 days ago',
  confidenceScore: 82,
  nextCheck: '5 days',
};

const DEFAULT_ROUTINE_SCORE: RoutineScore = {
  overall: 86,
  compatibility: 82,
  effectiveness: 90,
  costEfficiency: 80,
  compliance: 92,
  simplicity: 78,
};





// ─── Sub-components ──────────────────────────────────────────────────────────

function AgentStatusCard({ onNavigate }: { onNavigate: (s: ScreenType) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-900 via-teal-950 to-slate-950 border border-teal-700/40 p-6 text-white shadow-lg"
    >
      {/* Glow orb */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400">Agent Active</span>
          </div>
          <h2 className="font-display font-black text-xl tracking-tight">Your MemoryAgent</h2>
          <p className="text-sm text-teal-200/70">Last updated your routine {AGENT_STATS.lastUpdated}</p>
        </div>

        <button
          onClick={() => onNavigate('chat')}
          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-2 rounded-xl text-[11px] font-bold transition"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Chat
        </button>
      </div>

      {/* Memory summary pills */}
      <div className="mt-5 flex flex-wrap gap-2">
        {[
          { label: `${AGENT_STATS.products} products`, icon: '🧴' },
          { label: `${AGENT_STATS.reports} reports`, icon: '📄' },
          { label: `${AGENT_STATS.weeksHistory} weeks history`, icon: '🕰️' },
        ].map(({ label, icon }) => (
          <span
            key={label}
            className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-[11px] font-semibold text-teal-100"
          >
            <span>{icon}</span> {label}
          </span>
        ))}
      </div>

      {/* Confidence bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="text-teal-300 font-semibold">Agent Confidence</span>
          <span className="font-bold text-white">{AGENT_STATS.confidenceScore}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${AGENT_STATS.confidenceScore}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            className="h-full bg-gradient-to-r from-teal-400 to-green-400 rounded-full"
          />
        </div>
        <p className="text-[10px] text-teal-400/70 mt-1">"{AGENT_STATS.confidenceScore >= 80 ? 'I know you well' : 'Still learning'}" — next check in {AGENT_STATS.nextCheck}</p>
      </div>
    </motion.div>
  );
}

function RoutineCard({ steps, onToggleStep, onGenerateRoutine, isGenerating }: { steps: RoutineStep[]; onToggleStep: (id: string, isCompleted: boolean) => void; onGenerateRoutine: () => void; isGenerating: boolean; }) {
  const [activePeriod, setActivePeriod] = useState<'morning' | 'evening'>('morning');

  const periodSteps = steps.filter(s => s.period === activePeriod);
  const completedCount = periodSteps.filter(s => s.isCompleted).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="font-display font-black text-base text-slate-900 dark:text-white">Active Routine</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {periodSteps.length > 0 ? `AI-generated · ${completedCount}/${periodSteps.length} steps done for ${activePeriod}` : 'No routine set'}
          </p>
        </div>
        <button
          onClick={onGenerateRoutine}
          disabled={isGenerating}
          className="text-xs font-bold text-teal-700 dark:text-teal-400 flex items-center gap-1 hover:underline disabled:opacity-50"
        >
          {isGenerating ? 'Optimizing...' : 'Optimize Routine'} <Sparkles className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Period tabs */}
      <div className="flex gap-1 mx-5 mt-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
        {(['morning', 'evening'] as const).map(p => (
          <button
            key={p}
            onClick={() => setActivePeriod(p)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${
              activePeriod === p
                ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {p === 'morning' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Steps */}
      <div className="px-5 py-4 space-y-2">
        <AnimatePresence>
          {periodSteps.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">Click Optimize Routine to generate steps from your inventory.</p>
          ) : periodSteps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                step.isCompleted
                  ? 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-200/50 dark:border-teal-800/30'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-700/30'
              }`}
            >
              <button
                onClick={() => onToggleStep(step.id, !step.isCompleted)}
                className="shrink-0"
                aria-label={step.isCompleted ? 'Mark step as incomplete' : 'Mark step as complete'}
              >
                <CheckCircle2 className={`w-5 h-5 transition-colors ${
                  step.isCompleted ? 'text-teal-600 dark:text-teal-400' : 'text-slate-300 dark:text-slate-600'
                }`} />
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${
                  step.isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
                }`}>
                  {step.brand} {step.productName}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">{step.keyIngredient}</p>
              </div>
              {step.waitAfterMins > 0 && (
                <span className="shrink-0 flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                  <Clock className="w-3 h-3" /> {step.waitAfterMins}m
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="px-5 pb-5">
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
          <span>{activePeriod.charAt(0).toUpperCase() + activePeriod.slice(1)} adherence</span>
          <span className="font-bold text-teal-700 dark:text-teal-400">{periodSteps.length > 0 ? Math.round((completedCount / periodSteps.length) * 100) : 0}%</span>
        </div>
        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${periodSteps.length > 0 ? (completedCount / periodSteps.length) * 100 : 0}%` }}
            transition={{ duration: 0.4 }}
            className="h-full bg-teal-500 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}

function RoutineScoreCard({ score, onNavigate }: { score: RoutineScore; onNavigate: (s: ScreenType) => void }) {
  const dimensions = [
    { key: 'compatibility', label: 'Compatibility', value: score.compatibility, icon: ShieldCheck, color: 'text-teal-600 dark:text-teal-400', bar: 'bg-teal-500' },
    { key: 'effectiveness', label: 'Effectiveness', value: score.effectiveness, icon: TrendingUp, color: 'text-green-600 dark:text-green-400', bar: 'bg-green-500' },
    { key: 'costEfficiency', label: 'Cost Efficiency', value: score.costEfficiency, icon: DollarSign, color: 'text-amber-600 dark:text-amber-400', bar: 'bg-amber-500' },
    { key: 'compliance', label: 'Dr. Compliance', value: score.compliance, icon: Brain, color: 'text-purple-600 dark:text-purple-400', bar: 'bg-purple-500' },
    { key: 'simplicity', label: 'Simplicity', value: score.simplicity, icon: Layers, color: 'text-blue-600 dark:text-blue-400', bar: 'bg-blue-500' },
  ];

  const getScoreColor = (s: number) =>
    s >= 85 ? 'text-teal-600 dark:text-teal-400' : s >= 70 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-black text-base text-slate-900 dark:text-white">Routine Score</h3>
          <p className="text-[11px] text-slate-400">5-dimension AI analysis</p>
        </div>
        <div className="text-right">
          <div className={`font-display font-black text-3xl ${getScoreColor(score.overall)}`}>{score.overall}</div>
          <div className="text-[10px] text-slate-400 font-bold">/ 100</div>
        </div>
      </div>

      <div className="space-y-3.5">
        {dimensions.map(({ key, label, value, icon: Icon, color, bar }, idx) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + idx * 0.06 }}
            className="flex items-center gap-3"
          >
            <Icon className={`w-4 h-4 shrink-0 ${color}`} />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 w-28 shrink-0">{label}</span>
            <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 + idx * 0.06 }}
                className={`h-full ${bar} rounded-full`}
              />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 w-8 text-right">{value}</span>
          </motion.div>
        ))}
      </div>


    </motion.div>
  );
}



function QuickStats({ onNavigate }: { onNavigate: (s: ScreenType) => void }) {
  const stats = [
    { label: 'AM Adherence', value: '94%', delta: '+12%', positive: true, screen: 'memory-timeline' as ScreenType },
    { label: 'PM Adherence', value: '72%', delta: '+28%', positive: true, screen: 'memory-timeline' as ScreenType },
    { label: 'Routine Score', value: '86', delta: '+8', positive: true, screen: 'agent-dashboard' as ScreenType },
    { label: 'Pending Insights', value: '2', delta: '', positive: true, screen: 'agent-insights' as ScreenType },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s, i) => (
        <motion.button
          key={s.label}
          onClick={() => onNavigate(s.screen)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i }}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs text-left hover:border-teal-500/40 transition group"
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{s.label}</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="font-display font-black text-2xl text-slate-900 dark:text-white">{s.value}</span>
            {s.delta && (
              <span className={`text-[10px] font-bold mb-0.5 ${s.positive ? 'text-teal-600' : 'text-red-500'}`}>
                {s.delta}
              </span>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AgentDashboard({ onScreenChange }: AgentDashboardProps) {
  const [routineScore, setRoutineScore] = useState<RoutineScore>(DEFAULT_ROUTINE_SCORE);
  const [routineSteps, setRoutineSteps] = useState<RoutineStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [progressRes, routineRes] = await Promise.all([
        fetch('/api/patient-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inventory: [], usageHistory: [] })
        }),
        fetch('/api/routine')
      ]);

      if (progressRes.ok) {
        const data = await progressRes.json();
        if (data.routineScore) setRoutineScore(data.routineScore);
      }

      if (routineRes.ok) {
        const data = await routineRes.json();
        if (data.steps) setRoutineSteps(data.steps);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleStep = async (id: string, isCompleted: boolean) => {
    // Optimistic update
    setRoutineSteps(prev => prev.map(s => s.id === id ? { ...s, isCompleted } : s));
    try {
      await fetch('/api/routine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isCompleted })
      });
    } catch (e) {
      console.error('Failed to toggle step:', e);
      // Revert on error
      setRoutineSteps(prev => prev.map(s => s.id === id ? { ...s, isCompleted: !isCompleted } : s));
    }
  };

  const handleGenerateRoutine = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-routine', { method: 'POST' });
      if (res.ok) {
        await fetchData(); // refresh steps
      } else {
        alert('Failed to generate routine. Check if you have inventory items.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-5 pb-12"
    >
      <AgentStatusCard onNavigate={onScreenChange} />
      <QuickStats onNavigate={onScreenChange} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-2 space-y-5">
          <RoutineCard 
            steps={routineSteps} 
            onToggleStep={handleToggleStep} 
            onGenerateRoutine={handleGenerateRoutine}
            isGenerating={isGenerating}
          />
        </div>
        <div className="space-y-5">
          <RoutineScoreCard score={routineScore} onNavigate={onScreenChange} />
        </div>
      </div>
    </motion.div>
  );
}
