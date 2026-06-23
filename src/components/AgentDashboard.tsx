'use client';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
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

const ROUTINE_SCORE: RoutineScore = {
  overall: 86,
  compatibility: 82,
  effectiveness: 90,
  costEfficiency: 80,
  compliance: 92,
  simplicity: 78,
};

const MORNING_STEPS: RoutineStep[] = [
  {
    id: 'ms1', stepNumber: 1, period: 'morning',
    productName: 'SA Hydrating Cleanser', brand: 'CeraVe',
    instructions: 'Apply to damp face, massage 30s, rinse',
    whyIncluded: 'Delivers salicylic acid as the first step on bare skin — essential for Grade II acne per your June 18 report.',
    keyIngredient: 'Salicylic Acid', waitAfterMins: 2, isOptional: false, isCompleted: true,
  },
  {
    id: 'ms2', stepNumber: 2, period: 'morning',
    productName: '10% Vitamin C Serum', brand: 'The Inkey List',
    instructions: '3 drops, pat into skin, do not rub',
    whyIncluded: 'Recommended for hyperpigmentation in your report. Applied AM to avoid retinol oxidation conflict.',
    keyIngredient: 'L-Ascorbic Acid', waitAfterMins: 3, isOptional: false, isCompleted: true,
  },
  {
    id: 'ms3', stepNumber: 3, period: 'morning',
    productName: 'Moisturizing Lotion', brand: 'CeraVe',
    instructions: 'Apply all over face, neck included',
    whyIncluded: 'Ceramide barrier support — critical for skin recovering from BHA exfoliation.',
    keyIngredient: 'Ceramides', waitAfterMins: 1, isOptional: false, isCompleted: false,
  },
  {
    id: 'ms4', stepNumber: 4, period: 'morning',
    productName: 'SPF 50+ Sunscreen', brand: 'La Roche-Posay',
    instructions: 'Final step — 2 finger lengths, reapply every 2 hours',
    whyIncluded: 'Non-negotiable with Vitamin C and any active ingredients. Also protects against hyperpigmentation worsening.',
    keyIngredient: 'UV Filters', waitAfterMins: 0, isOptional: false, isCompleted: false,
  },
];

const PENDING_DECISIONS: AgentDecision[] = [
  {
    id: 'ad1',
    decisionType: 'simplify_routine',
    status: 'pending',
    title: 'Simplify your PM routine from 6 → 3 steps',
    reasoning: 'You completed your PM routine 3 of 7 nights this week. The 6-step length appears to be the barrier. Removing the 2 optional steps preserves clinical effectiveness while improving your adherence.',
    confidence: 0.91,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 5 * 86400000).toISOString(),
  },
  {
    id: 'ad2',
    decisionType: 'agent_alert',
    status: 'pending',
    title: 'Retinol introduction window opens in 3 days',
    reasoning: 'You have maintained a consistent AM routine for 28 days. Your skin is ready for retinol introduction at 0.025% — as recommended by Dr. Okafor.',
    confidence: 0.87,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

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

function RoutineCard({ onNavigate }: { onNavigate: (s: ScreenType) => void }) {
  const [activePeriod, setActivePeriod] = useState<'morning' | 'evening'>('morning');
  const [steps, setSteps] = useState<RoutineStep[]>(MORNING_STEPS);

  const completedCount = steps.filter(s => s.isCompleted).length;

  const toggleStep = (id: string) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, isCompleted: !s.isCompleted } : s));
  };

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
          <p className="text-[11px] text-slate-400 mt-0.5">AI-generated · {completedCount}/{steps.length} steps done today</p>
        </div>
        <button
          onClick={() => onNavigate('routine-view')}
          className="text-xs font-bold text-teal-700 dark:text-teal-400 flex items-center gap-1 hover:underline"
        >
          Full view <ChevronRight className="w-3.5 h-3.5" />
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
        <AnimatePresence mode="wait">
          {steps.map((step, idx) => (
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
                onClick={() => toggleStep(step.id)}
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
          <span>Today's adherence</span>
          <span className="font-bold text-teal-700 dark:text-teal-400">{Math.round((completedCount / steps.length) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${(completedCount / steps.length) * 100}%` }}
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

      <button
        onClick={() => onNavigate('routine-view')}
        className="mt-5 w-full text-center py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
      >
        View full routine breakdown
      </button>
    </motion.div>
  );
}

function InsightsFeed({ decisions, onNavigate }: { decisions: AgentDecision[]; onNavigate: (s: ScreenType) => void }) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [approved, setApproved] = useState<string[]>([]);

  const visible = decisions.filter(d => !dismissed.includes(d.id));

  const getInsightIcon = (type: string) => {
    if (type === 'simplify_routine') return <Zap className="w-4 h-4 text-amber-500" />;
    if (type === 'agent_alert') return <Bell className="w-4 h-4 text-teal-500" />;
    return <Brain className="w-4 h-4 text-purple-500" />;
  };

  const getInsightBg = (type: string) => {
    if (type === 'simplify_routine') return 'border-amber-200/60 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-950/10';
    if (type === 'agent_alert') return 'border-teal-200/60 dark:border-teal-800/30 bg-teal-50/50 dark:bg-teal-950/10';
    return 'border-purple-200/60 dark:border-purple-800/30 bg-purple-50/50 dark:bg-purple-950/10';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="font-display font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-500" />
            Agent Insights
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Autonomous decisions this week</p>
        </div>
        <button
          onClick={() => onNavigate('agent-insights')}
          className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
        >
          See all <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <AnimatePresence>
          {visible.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-slate-400 text-center py-4"
            >
              No pending insights — your agent is happy with your routine ✓
            </motion.p>
          )}

          {visible.map((decision) => (
            <motion.div
              key={decision.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-xl border space-y-3 ${getInsightBg(decision.decisionType)}`}
            >
              <div className="flex items-start gap-2">
                {getInsightIcon(decision.decisionType)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{decision.title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{decision.reasoning}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">
                  Confidence: {Math.round(decision.confidence * 100)}%
                </span>
                {approved.includes(decision.id) ? (
                  <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setApproved(p => [...p, decision.id])}
                      className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition"
                    >
                      <ThumbsUp className="w-3 h-3" /> Approve
                    </button>
                    <button
                      onClick={() => setDismissed(p => [...p, decision.id])}
                      className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition"
                    >
                      <ThumbsDown className="w-3 h-3" /> Dismiss
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function QuickStats({ onNavigate }: { onNavigate: (s: ScreenType) => void }) {
  const stats = [
    { label: 'AM Adherence', value: '94%', delta: '+12%', positive: true, screen: 'progress' as ScreenType },
    { label: 'PM Adherence', value: '72%', delta: '+28%', positive: true, screen: 'progress' as ScreenType },
    { label: 'Routine Score', value: '86', delta: '+8', positive: true, screen: 'routine-view' as ScreenType },
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
      <RoutineCard onNavigate={onScreenChange} />
      <RoutineScoreCard score={ROUTINE_SCORE} onNavigate={onScreenChange} />
      <InsightsFeed decisions={PENDING_DECISIONS} onNavigate={onScreenChange} />
    </motion.div>
  );
}
