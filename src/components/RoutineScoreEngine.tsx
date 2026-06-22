// src/components/RoutineScoreEngine.tsx
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { motion } from 'motion/react';
import { Circle, CheckCircle, XCircle, Clock } from 'lucide-react';

interface ScoreProps {
  compatibility: number; // 0-100
  effectiveness: number;
  costEfficiency: number;
  dermatologistCompliance: number;
}

// Compute overall weighted score (equal weights for now)
function computeOverall({ compatibility, effectiveness, costEfficiency, dermatologistCompliance }: ScoreProps): number {
  return Math.round((compatibility + effectiveness + costEfficiency + dermatologistCompliance) / 4);
}

export default function RoutineScoreEngine({ compatibility, effectiveness, costEfficiency, dermatologistCompliance }: ScoreProps) {
  const overall = computeOverall({ compatibility, effectiveness, costEfficiency, dermatologistCompliance });

  const sections = [
    { label: 'Compatibility', value: compatibility, icon: <Circle size={16} className="text-teal-600" /> },
    { label: 'Effectiveness', value: effectiveness, icon: <CheckCircle size={16} className="text-green-600" /> },
    { label: 'Cost Efficiency', value: costEfficiency, icon: <Clock size={16} className="text-amber-600" /> },
    { label: 'Dermatologist Compliance', value: dermatologistCompliance, icon: <XCircle size={16} className="text-purple-600" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-black text-lg text-slate-950 dark:text-white">
          Routine Score
        </h3>
        <div className="text-2xl font-bold text-teal-700 dark:text-teal-400">{overall}</div>
      </div>
      <div className="space-y-2">
        {sections.map((s) => (
          <div key={s.label} className="flex items-center">
            <div className="w-1/3 flex items-center">
              {s.icon}
              <span className="ml-2 text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                {s.label}
              </span>
            </div>
            <div className="w-2/3 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${s.value}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full bg-teal-500"
              />
            </div>
            <span className="ml-2 text-sm font-medium text-slate-800 dark:text-slate-200 w-8 text-right">
              {s.value}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
