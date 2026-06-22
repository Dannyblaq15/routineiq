/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import RoutineScoreEngine from './RoutineScoreEngine';
import { recentAnalysesList } from '../data';
import { Microscope, Brain, AlertOctagon, TrendingUp, Sparkles, ArrowRight, Activity, BadgeAlert } from 'lucide-react';
import { ScreenType, PatientAnalysis } from '../types';

interface HomeOverviewProps {
  onScreenChange: (screen: ScreenType) => void;
  analyses: PatientAnalysis[];
  onOpenAnalysis: (id: string) => void;
}

export default function HomeOverview({ onScreenChange, analyses, onOpenAnalysis }: HomeOverviewProps) {
  // Compute some brief metrics
  const totalReports = analyses.length;
  const highSeverityReports = analyses.filter(a => a.severity === 'High').length;
  const pendingReports = analyses.filter(a => a.status === 'PENDING').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8 pb-12"
    >
      {/* Top Banner Accent */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-teal-950 text-white p-6 md:p-8 rounded-3xl border border-teal-800 shadow-md">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-1.5 bg-teal-800 text-teal-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider w-fit">
            <Sparkles className="w-3 h-3" /> System Status: Online
          </div>
          <h2 className="font-display font-black text-2xl md:text-3xl tracking-tight">Welcome to clinical intelligence</h2>
          <p className="text-teal-200/80 text-xs md:text-sm">
            Review diagnostics logs, perform OCR scanning on dermatological reports, and cross-reference your product inventory for maximum clinical security.
          </p>
        </div>
        <button
          onClick={() => onScreenChange('analysis')}
          className="px-5 py-3 bg-white hover:bg-teal-50 text-teal-950 font-bold text-xs rounded-xl shadow-xs transition duration-200 cursor-pointer text-center shrink-0 flex items-center gap-2"
        >
          <span>Run Fresh Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Bento Grid Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Report Registry</span>
            <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
              <Microscope className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-display font-black text-2xl md:text-3xl text-slate-950 dark:text-white">{totalReports}</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Processed dermatological entries</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Hazard Flags</span>
            <div className="p-1.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-lg">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-display font-black text-2xl md:text-3xl text-red-600 dark:text-red-400">{highSeverityReports}</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Severe interaction conflicts found</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Synthesizing Queue</span>
            <div className="p-1.5 bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400 rounded-lg">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-display font-black text-2xl md:text-3xl text-yellow-600 dark:text-yellow-400">{pendingReports}</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Undergoing machine inspection</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Optimal Ratio</span>
            <div className="p-1.5 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-display font-black text-2xl md:text-3xl text-teal-700 dark:text-teal-400">92%</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Cost efficiency improvement</p>
          </div>
        </div>
      </div>
{/* Routine Score Engine */}
<RoutineScoreEngine compatibility={85} effectiveness={78} costEfficiency={92} dermatologistCompliance={80} />

      {/* Main Grid: Recent Analyses & Clinical Guides */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Col (2/3): Recent Diagnostics Registry */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs space-y-5 lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-50 dark:border-slate-800/85">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">Recent Extract Log</h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Historical records of scanned dermatological directives</p>
            </div>
            <button
              onClick={() => onScreenChange('analysis')}
              className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              See All Scans
            </button>
          </div>

          <div className="space-y-3">
            {recentAnalysesList.map((rep) => (
              <div 
                key={rep.id} 
                onClick={() => onOpenAnalysis(rep.id)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 cursor-pointer transition"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-lg shrink-0">
                    <Microscope className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-400">{rep.id}</span>
                      <h4 className="font-bold text-sm text-slate-850 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                        {rep.type}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Scanned by {rep.clinician} on {rep.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {rep.severity && (
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider
                      ${rep.severity === 'High' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300' 
                        : rep.severity === 'Medium'
                          ? 'bg-yellow-105 text-yellow-850 dark:bg-yellow-950/60 dark:text-yellow-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300'
                      }`}
                    >
                      {rep.severity}
                    </span>
                  )}
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-tight
                    ${rep.status === 'COMPLETE' 
                      ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300' 
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400'
                    }`}
                  >
                    {rep.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col (1/3): Diagnostic Insights / Quick Help */}
        <div className="space-y-6">
          {/* Diagnostic Widget */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-2xl shadow-md border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <BadgeAlert className="w-5 h-5 text-red-500 shrink-0 animate-pulse" />
              <h4 className="font-semibold text-sm">Critical Clinical Rule</h4>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              Applying high-concentration <strong>Benzoyl Peroxide</strong> concurrently with <strong>Vitamin C (L-Ascorbic Acid)</strong> will oxidize the biological vitamins, resulting in total loss of potency and secondary severe dermal irritation.
            </p>

            <button
              onClick={() => onScreenChange('intelligence')}
              className="w-full text-center py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition cursor-pointer"
            >
              Examine Synergy Matrix
            </button>
          </div>

          {/* Quick Guide */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs space-y-4">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Brain className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Expert System Quick Guide
            </h4>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="flex gap-2.5">
                <span className="font-bold text-teal-700 dark:text-teal-400">Step 1:</span>
                <p>Scan a clinical diagnosis PDF or image inside <strong>Report Analysis</strong> page to parse molecules.</p>
              </div>
              <div className="flex gap-2.5">
                <span className="font-bold text-teal-700 dark:text-teal-400">Step 2:</span>
                <p>Register present inventory items to check immediate compatibility against extracted routine.</p>
              </div>
              <div className="flex gap-2.5">
                <span className="font-bold text-teal-700 dark:text-teal-400">Step 3:</span>
                <p>Utilize the <strong>Intelligence Engine</strong> to identify local cost-effective product substitutes.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
