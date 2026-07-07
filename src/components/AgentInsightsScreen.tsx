'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, Zap, Bell, Brain, ThumbsUp, ThumbsDown, ArrowLeft } from 'lucide-react';
import { AgentDecision } from '../types';

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

export default function AgentInsightsScreen({ onBack }: { onBack: () => void }) {
  const [decisions, setDecisions] = useState<AgentDecision[]>(PENDING_DECISIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [approved, setApproved] = useState<string[]>([]);

  useEffect(() => {
    async function fetchInsights() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/agent-insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inventory: [], recentReports: [] })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.insights) setDecisions(data.insights);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchInsights();
  }, []);

  const visible = decisions.filter(d => !dismissed.includes(d.id));

  const getInsightIcon = (type: string) => {
    if (type === 'simplify_routine') return <Zap className="w-5 h-5 text-amber-500" />;
    if (type === 'agent_alert') return <Bell className="w-5 h-5 text-teal-500" />;
    return <Brain className="w-5 h-5 text-purple-500" />;
  };

  const getInsightBg = (type: string) => {
    if (type === 'simplify_routine') return 'border-amber-200/60 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-950/10';
    if (type === 'agent_alert') return 'border-teal-200/60 dark:border-teal-800/30 bg-teal-50/50 dark:bg-teal-950/10';
    return 'border-purple-200/60 dark:border-purple-800/30 bg-purple-50/50 dark:bg-purple-950/10';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6 pb-12"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-display font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-500" />
              Agent Insights
            </h3>
            <p className="text-xs text-slate-400 mt-1">Autonomous decisions and alerts for your routine.</p>
          </div>
          {isLoading && <span className="text-xs text-teal-500 font-bold animate-pulse">Analyzing...</span>}
        </div>

        <div className="p-6 space-y-4">
          <AnimatePresence>
            {visible.length === 0 && !isLoading && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-slate-400 text-center py-8"
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
                className={`p-5 rounded-xl border space-y-4 ${getInsightBg(decision.decisionType)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getInsightIcon(decision.decisionType)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-slate-800 dark:text-slate-100">{decision.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">{decision.reasoning}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500 font-medium">
                    Confidence: <span className="font-bold">{Math.round(decision.confidence * 100)}%</span>
                  </span>
                  {approved.includes(decision.id) ? (
                    <span className="text-xs text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Approved
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setApproved(p => [...p, decision.id])}
                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => setDismissed(p => [...p, decision.id])}
                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" /> Dismiss
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
