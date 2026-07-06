/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LineChart, BarChart2, Activity, PieChart, ShieldAlert, Sparkles, Clipboard, ArrowUpRight } from 'lucide-react';

interface AnalyticsDataPoint {
  month: string;
  scans: number;
  conflicts: number;
  complianceRate: number;
}

const DEFAULT_HISTORICAL_SERIES: AnalyticsDataPoint[] = [
  { month: 'May 2026', scans: 14, conflicts: 2, complianceRate: 88 },
  { month: 'Jun 2026', scans: 19, conflicts: 1, complianceRate: 91 },
  { month: 'Jul 2026', scans: 25, conflicts: 4, complianceRate: 82 },
  { month: 'Aug 2026', scans: 31, conflicts: 3, complianceRate: 89 },
  { month: 'Sep 2026', scans: 45, conflicts: 6, complianceRate: 92 },
  { month: 'Oct 2026', scans: 52, conflicts: 2, complianceRate: 94 },
];

const DEFAULT_CONDITION_DISTRIBUTION = [
  { name: 'Epidermal Barrier Integrity', percentage: 42, color: 'bg-teal-600', fill: '#005c55' },
  { name: 'Active Acne Inflammation', percentage: 28, color: 'bg-rose-500', fill: '#f43f5e' },
  { name: 'Solar Hyperpigmentation', percentage: 18, color: 'bg-amber-500', fill: '#f59e0b' },
  { name: 'Post-Laser Tissue Renewal', percentage: 12, color: 'bg-blue-500', fill: '#3b82f6' }
];

export default function PatientAnalytics() {
  const [activeTab, setActiveTab] = useState<'scans' | 'compliance'>('scans');
  const [historicalSeries, setHistoricalSeries] = useState<AnalyticsDataPoint[]>(DEFAULT_HISTORICAL_SERIES);
  const [conditionDistribution, setConditionDistribution] = useState(DEFAULT_CONDITION_DISTRIBUTION);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchProgress() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/patient-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inventory: [], usageHistory: [] })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.historicalSeries) setHistoricalSeries(data.historicalSeries);
          if (data.conditionDistribution) setConditionDistribution(data.conditionDistribution);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProgress();
  }, []);

  const maxScans = Math.max(...historicalSeries.map(d => d.scans), 1);
  const maxCompliance = 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8 pb-12"
    >
      <div>
        <h2 className="font-display font-black text-2xl md:text-3xl text-slate-900 dark:text-white">Patient Diagnostics Analytics</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">View chronological performance, compliance scores, and skin diagnostic composition charts.</p>
      </div>

      {/* Main Dashboard Panel */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Side: Chronological Trends (2/3 col) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-xs lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-50 dark:border-slate-800">
            <div>
              <h3 className="font-semibold text-slate-950 dark:text-white text-sm">Chronological Diagnostic Progression</h3>
              <p className="text-[10px] text-slate-400">Historical performance metrics spanning active clinical cohorts</p>
            </div>

            <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-lg gap-1">
              <button
                onClick={() => setActiveTab('scans')}
                className={`py-1 px-3 text-[11px] font-bold rounded-md uppercase transition cursor-pointer
                  ${activeTab === 'scans' 
                    ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-white shadow-xs' 
                    : 'text-slate-400 hover:text-slate-700'
                  }`}
              >
                Scan Trends
              </button>
              <button
                onClick={() => setActiveTab('compliance')}
                className={`py-1 px-3 text-[11px] font-bold rounded-md uppercase transition cursor-pointer
                  ${activeTab === 'compliance' 
                    ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-white shadow-xs' 
                    : 'text-slate-400 hover:text-slate-700'
                  }`}
              >
                Compliance (%)
              </button>
            </div>
          </div>

          {/* Elegant SVG-based Chart */}
          <div className="relative pt-4">
            <div className="h-64 flex items-end justify-between gap-4 pt-6 pb-2 px-2 border-b border-l border-slate-100 dark:border-slate-800">
              
              {/* Backing Guidelines */}
              <div className="absolute inset-x-0 top-6 border-t border-slate-100/60 dark:border-slate-800/40 pointer-events-none" />
              <div className="absolute inset-x-0 top-1/3 border-t border-slate-100/60 dark:border-slate-800/40 pointer-events-none" />
              <div className="absolute inset-x-0 top-2/3 border-t border-slate-100/60 dark:border-slate-800/40 pointer-events-none" />

              {historicalSeries.map((data, idx) => {
                const targetValue = activeTab === 'scans' ? data.scans : data.complianceRate;
                const maxValue = activeTab === 'scans' ? maxScans : maxCompliance;
                const barHeightPercent = (targetValue / maxValue) * 100;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                    {/* Hover tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition absolute -top-12 bg-slate-900 text-white text-[10px] font-mono px-2 py-1 rounded shadow-md pointer-events-none z-10 whitespace-nowrap text-center">
                      <p className="font-bold text-teal-300">{data.month}</p>
                      <p>{activeTab === 'scans' ? `Scans Code: ${data.scans}` : `Compliance: ${data.complianceRate}%`}</p>
                      <p className="text-[9px] text-red-400">{data.conflicts} active conflicts found</p>
                    </div>

                    {/* Bar graphic with dual highlights */}
                    <div className="w-full max-w-[48px] bg-slate-50 dark:bg-slate-800/30 rounded-t-lg h-48 flex items-end overflow-hidden">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${barHeightPercent}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.05 }}
                        className={`w-full rounded-t-md transition-colors duration-200
                          ${activeTab === 'scans' 
                            ? 'bg-teal-700/80 group-hover:bg-teal-700' 
                            : 'bg-emerald-600/85 group-hover:bg-emerald-650'
                          }`}
                      >
                        {/* Secondary inline visualization for conflict flags */}
                        <div 
                          className="w-full bg-red-500/80 cursor-pointer" 
                          style={{ height: `${(data.conflicts / 10) * 100}%` }}
                          title={`${data.conflicts} severe chemical conflicts detected`}
                        />
                      </motion.div>
                    </div>

                    {/* Label */}
                    <span className="text-[10px] text-slate-400 font-bold uppercase mt-2 text-center truncate w-full">
                      {data.month.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Micro legends */}
            <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400" aria-hidden="true">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-teal-750 rounded" />
                <span>Volume indicator</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded" />
                <span>Chemical conflicts overlay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Condition Distribution & Audit Metrics */}
        <div className="space-y-6">
          {/* Distribution card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h3 className="font-semibold text-slate-950 dark:text-white text-sm">Condition Composition</h3>
              <p className="text-[10px] text-slate-400">Diagnosis segments extracted by OCR models</p>
            </div>

            <div className="space-y-4 relative">
              {isLoading && (
                <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 flex items-center justify-center z-10 rounded-xl backdrop-blur-sm">
                  <Activity className="w-5 h-5 text-teal-600 animate-spin" />
                </div>
              )}
              {conditionDistribution.map((cond, i) => (
                <div key={cond.name} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{cond.name}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-350">{cond.percentage}%</span>
                  </div>
                  <div className="h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${cond.color}`} 
                      style={{ width: `${cond.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinic Compliance Checklist */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-xs space-y-3.5">
            <h3 className="font-semibold text-slate-950 dark:text-white text-sm flex items-center gap-2">
              <Clipboard className="w-4 h-4 text-teal-650" />
              Patient Adherence Checklist
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5">
                <input 
                  type="checkbox" 
                  defaultChecked 
                  id="chk1"
                  className="mt-0.5 accent-teal-700 border-slate-300 rounded focus:ring-teal-500 cursor-pointer" 
                />
                <label htmlFor="chk1" className="text-slate-650 dark:text-slate-350">Confirm patient is not applying AHA in daytime (solar sensitivity prevention).</label>
              </div>

              <div className="flex items-start gap-2.5">
                <input 
                  type="checkbox" 
                  defaultChecked 
                  id="chk2"
                  className="mt-0.5 accent-teal-700 border-slate-300 rounded focus:ring-teal-500 cursor-pointer" 
                />
                <label htmlFor="chk2" className="text-slate-650 dark:text-slate-350">Confirm moisturizer replenishment rate matches barrier dehydration index.</label>
              </div>

              <div className="flex items-start gap-2.5">
                <input 
                  type="checkbox" 
                  id="chk3"
                  className="mt-0.5 accent-teal-700 border-slate-300 rounded focus:ring-teal-500 cursor-pointer" 
                />
                <label htmlFor="chk3" className="text-slate-650 dark:text-slate-350">Request 14-day post-laser follow-up photography for epidermal thickness check.</label>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
