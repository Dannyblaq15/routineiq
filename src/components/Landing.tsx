/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import Image from 'next/image';
import { Microscope, Package, Sparkles, ShieldCheck, Check, AlertTriangle, FileText, BookOpen, CloudSun, Activity } from 'lucide-react';
import { ScreenType } from '../types';

interface LandingProps {
  onScreenChange: (screen: ScreenType) => void;
}

export default function Landing({ onScreenChange }: LandingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-16 pb-16"
    >
      {/* Brand Hero Showcase */}
      <section 
        className="relative overflow-hidden py-16 px-6 md:px-12 rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-md text-center max-w-5xl mx-auto"
        aria-labelledby="hero-heading"
      >
        {/* Background Image Showcase */}
        <div className="absolute inset-0 z-0 opacity-30 dark:opacity-25 pointer-events-none select-none">
          <Image
            src="/skincare-hero-bg.png"
            alt="Skincare Laboratory Background"
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-white/40 dark:via-slate-900/40 to-transparent" />
        </div>

        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 border border-teal-100 dark:border-teal-900/50">
              <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />
              Your Everyday Skincare Guide
            </div>
          </div>

          <h2 
            id="hero-heading" 
            className="font-display font-black text-3xl md:text-5.5xl text-slate-900 dark:text-white leading-tight max-w-3xl mx-auto tracking-tight"
          >
            Skincare routines made simple, <span className="text-teal-700 dark:text-teal-400 underline decoration-teal-600/30">backed by real science</span>.
          </h2>
          
          <p className="mt-5 text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-normal">
            Stop guessing what goes on your face. RoutineIQ scans your skincare shelf, reads your dermatologist reports, and checks for toxic ingredient conflicts. It's your personal skin guide—no complicated medical jargon, just clean, personalized routines.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onScreenChange('analysis')}
              className="px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl transition duration-200 cursor-pointer shadow-md shadow-teal-700/10 flex items-center gap-2"
            >
              <Microscope className="w-4 h-4" />
              Analyze Clinical Report
            </button>
            <button
              onClick={() => onScreenChange('inventory')}
              className="px-6 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-xs rounded-xl transition duration-200 cursor-pointer border border-slate-200/50 dark:border-slate-700 flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              Inventory & Compatibility
            </button>
          </div>

          {/* Clean Humanlike Trust Badges */}
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center">
              <span className="font-display font-black text-2xl text-teal-700 dark:text-teal-400">Zero Irritants</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider mt-1">Clashing actives flagged</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-display font-black text-2xl text-teal-700 dark:text-teal-400">Instant Scan</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider mt-1">Just snap your shelf</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-display font-black text-2xl text-teal-700 dark:text-teal-400">Derm-Aligned</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider mt-1">Professional guidance</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-display font-black text-2xl text-teal-700 dark:text-teal-400">Clean Science</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider mt-1">No marketing-only claims</span>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Features Showcase */}
      <section className="space-y-8 max-w-5xl mx-auto">
        <div className="text-center">
          <h3 className="font-display font-extrabold text-2xl md:text-3xl text-slate-900 dark:text-white tracking-tight">How we keep your skin healthy</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto leading-relaxed">
            Simple steps to avoid irritation and get the absolute most out of your daily products.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Active Conflicts Card */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Stop wasting money on products that clash
              </h4>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Retinoids, Vitamin C, AHAs/BHAs—using them at the wrong times or together can cause redness, damage your skin barrier, or render the active ingredients completely useless. We analyze your shelf instantly to map out exactly when to use what.
              </p>
            </div>
            
            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Common Clashes Checked</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 px-2.5 py-1 rounded-full font-medium border border-red-100 dark:border-red-900/30">Retinol + Vitamin C</span>
                <span className="text-[10px] bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 px-2.5 py-1 rounded-full font-medium border border-red-100 dark:border-red-900/30">Salicylic Acid + Glycolic Acid</span>
                <span className="text-[10px] bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 px-2.5 py-1 rounded-full font-medium border border-red-100 dark:border-red-900/30">Benzoyl Peroxide + Retinol</span>
              </div>
            </div>
          </div>

          {/* Report Translation Card */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Translate your dermatologist reports
              </h4>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Got a prescription or clinical report from your doctor? Upload it, and our clinical parser will automatically extract the core skin type recommendations, matching them with compatible products in your current shelf inventory.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">How it works</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <span className="w-4 h-4 rounded-full bg-teal-50 dark:bg-teal-950/50 text-[10px] text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">1</span>
                  <span>Upload a report or text description</span>
                </li>
                <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <span className="w-4 h-4 rounded-full bg-teal-50 dark:bg-teal-950/50 text-[10px] text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">2</span>
                  <span>Scan or add the products on your shelf</span>
                </li>
                <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <span className="w-4 h-4 rounded-full bg-teal-50 dark:bg-teal-950/50 text-[10px] text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">3</span>
                  <span>Get your tailored, conflict-free routine</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Active Skincare Memory Section */}
      <section className="bg-slate-100/40 dark:bg-slate-900/30 p-8 md:p-10 rounded-3xl border border-slate-200/50 dark:border-slate-800 max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 bg-teal-50/50 dark:bg-teal-950/30 px-3 py-1 rounded-full text-[10px] text-teal-600 dark:text-teal-400 font-bold border border-teal-100/50 dark:border-teal-900/30">
            <Sparkles className="w-3 h-3 text-teal-500" /> Active Skincare Memory
          </div>
          <h3 className="font-display font-extrabold text-2xl md:text-3xl text-slate-900 dark:text-white mt-3">An active memory for your skin's lifecycle</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto leading-relaxed">
            Skincare is a timeline, not a one-time check. RoutineIQ remembers your skin's history to protect your barrier dynamically.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Item 1: Reaction Log */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/80 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <BookOpen className="w-4.5 h-4.5" />
              </div>
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">Learn from past reactions</h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                When your skin reacts to a product, log it in your memory. The AI agent flags those specific ingredients in any new products you scan, preventing future irritation.
              </p>
            </div>
            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Prevents Redness & Rash</span>
          </div>

          {/* Item 2: Weather Sync */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/80 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <CloudSun className="w-4.5 h-4.5" />
              </div>
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">Adjusts with local weather</h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Dry winter air and humid summer heat need different care. Your agent checks the season to recommend heavier barriers or lighter hydration as your environment shifts.
              </p>
            </div>
            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Protects Skin Barrier</span>
          </div>

          {/* Item 3: pH Balance */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/80 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <Activity className="w-4.5 h-4.5" />
              </div>
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">Maintains optimal pH level</h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Too many strong active acids or serums can strip your skin. RoutineIQ watches the total concentration across your day's routine to keep your pH natural and balanced.
              </p>
            </div>
            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Balances Acid & Moisture</span>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
