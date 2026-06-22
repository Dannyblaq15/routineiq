/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { pricingPlansList, testimonialsList, comparisonMetricsList } from '../data';
import { Microscope, Brain, Package, Sparkles, TrendingUp, ShieldCheck, Check } from 'lucide-react';
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
      className="space-y-12 pb-16"
    >
      {/* Brand Hero Showcase */}
      <section 
        className="relative overflow-hidden bg-radial from-teal-900/10 via-transparent to-transparent py-14 px-6 md:px-10 rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-md text-center max-w-5xl mx-auto"
        aria-labelledby="hero-heading"
      >
        <div className="absolute top-4 right-4 bg-teal-100/80 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />
          Clinical-Grade Intelligence
        </div>

        <h2 
          id="hero-heading" 
          className="font-display font-black text-3xl md:text-5xl text-slate-900 dark:text-white leading-tight max-w-3xl mx-auto"
        >
          Diagnostic Extraction & Routine <span className="text-teal-700 dark:text-teal-400 underline decoration-teal-600/30">Formulary Matching</span>
        </h2>
        
        <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Unlock maximum cosmetic efficacy with high-density bio-informatic analysis. RoutineIQ extracts prescribing directives, identifies toxic chemical conflicts, and performs smart price optimization.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => onScreenChange('analysis')}
            className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-medium text-sm rounded-xl transition duration-200 cursor-pointer shadow-md shadow-teal-700/10 flex items-center gap-2"
          >
            <Microscope className="w-4 h-4" />
            Analyze Clinical Report
          </button>
          <button
            onClick={() => onScreenChange('inventory')}
            className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-sm rounded-xl transition duration-200 cursor-pointer border border-slate-200/50 dark:border-slate-700 flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            Inventory & Compatibility
          </button>
        </div>

        {/* Dynamic Trust Badges */}
        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <span className="font-display font-black text-2xl md:text-3xl text-teal-700 dark:text-teal-400">99.8%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-1">Accuracy Grade</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-display font-black text-2xl md:text-3xl text-teal-700 dark:text-teal-400">&lt; 3.2s</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-1">Diagnostic Speed</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-display font-black text-2xl md:text-3xl text-teal-700 dark:text-teal-400">4,900+</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-1">Active Formularies</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-display font-black text-2xl md:text-3xl text-teal-700 dark:text-teal-400">100%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-1">Conflict Checked</span>
          </div>
        </div>
      </section>

      {/* Primary Value Matrix */}
      <section className="space-y-6 max-w-5xl mx-auto">
        <div className="text-center">
          <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">The RoutineIQ Difference</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">Quantifiable results compiled over clinical research cohorts</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Comparison Metrics List */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              Cohort Performance Metrics
            </h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {comparisonMetricsList.map((metric, i) => (
                <div key={i} className="py-3 flex items-center justify-between gap-4">
                  <span className="font-medium text-sm text-slate-700 dark:text-slate-300">{metric.name}</span>
                  <div className="flex items-center gap-2.5 text-xs">
                    <span className="text-red-500 line-through font-mono">{metric.before}</span>
                    <span className="text-teal-600 dark:text-teal-400 font-mono font-bold bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded">
                      {metric.after}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Innovation Columns */}
          <div className="bg-teal-950/50 dark:bg-teal-950/20 p-6 rounded-2xl border border-teal-800/20 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <span className="bg-teal-800/10 text-teal-700 dark:text-teal-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                Advanced Molecular Parser
              </span>
              <h4 className="font-display font-bold text-lg text-teal-900 dark:text-teal-200">AI Chemist Collaboration</h4>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Our active deep learning transformer continuously matches and catalogs conflicts across pH ranges, ingredient families (like high concentration retinoids with acidic molecules), and light sensitivity profiles.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-teal-800/10 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-teal-600 dark:text-teal-400 shrink-0" />
              <p className="text-[11px] text-teal-700 dark:text-teal-300 font-medium">
                Verified with dermatological standard protocols in 2026. Fully safe, science-backed skin architecture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section className="space-y-6 max-w-5xl mx-auto" aria-labelledby="pricing-heading">
        <div className="text-center">
          <h3 id="pricing-heading" className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">Precision Pricing Models</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">Enterprise & Clinic options tailored to medical diagnostics</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pricingPlansList.map((plan, idx) => (
            <div
              key={idx}
              className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 transition-all hover:shadow-md relative flex flex-col justify-between
                ${plan.isPopular 
                  ? 'border-teal-600 dark:border-teal-400 shadow-sm' 
                  : 'border-slate-200/60 dark:border-slate-800'
                }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white dark:text-slate-900 dark:bg-teal-400 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  Recommended Choose
                </span>
              )}
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-950 dark:text-white text-base">{plan.name}</h4>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="font-display font-black text-3xl text-slate-950 dark:text-white">{plan.price}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">{plan.period}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 min-h-[32px] leading-relaxed">{plan.description}</p>
                </div>
                
                <ul className="space-y-2 py-3 border-t border-slate-100 dark:border-slate-800/80" aria-label={`Features included in ${plan.name} plan`}>
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onScreenChange('analysis')}
                className={`w-full py-2 px-4 rounded-xl text-xs font-semibold uppercase cursor-pointer transition
                  ${plan.isPopular 
                    ? 'bg-teal-700 hover:bg-teal-800 text-white' 
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white'
                  }`}
              >
                Activate {plan.name}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Banner */}
      <section className="bg-slate-100/50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800 max-w-5xl mx-auto space-y-6">
        <div className="text-center">
          <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white">Validation From Clinical Directors</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {testimonialsList.map((test, i) => (
            <div key={i} className="flex flex-col justify-between bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/80 shadow-xs">
              <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                {test.text}
              </p>
              
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-900 flex items-center gap-3">
                <img
                  src={test.imageUrl}
                  alt={test.author}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-teal-500/10"
                />
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{test.author}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
