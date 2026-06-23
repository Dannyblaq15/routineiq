'use client';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import {
  LayoutDashboard, BookOpen, MessageSquare,
  FileUp, ShoppingBag, Sparkles,
  ChevronRight, X, ArrowRight,
} from 'lucide-react';

// ─── Tour steps ───────────────────────────────────────────────────────────────

const STEPS = [
  {
    id: 'welcome',
    icon: null,          // uses logo
    emoji: null,
    color: 'from-teal-600 to-teal-800',
    badge: 'Welcome',
    title: 'Meet RoutineIQ',
    description:
      'Your personal AI skincare agent. It learns your skin history, reads your dermatologist reports, and builds a routine that actually works — then adapts it over time.',
    tip: null,
    cta: "Let's get started",
  },
  {
    id: 'dashboard',
    icon: LayoutDashboard,
    emoji: '🏠',
    color: 'from-teal-500 to-teal-700',
    badge: 'Step 1 of 5',
    title: 'Your Dashboard',
    description:
      'This is your home base. Every morning and evening you can check off your routine steps, see your routine score, and act on your agent\'s latest recommendations.',
    tip: '💡 Tap a step to mark it done. Your agent tracks your streak.',
    cta: 'Next',
  },
  {
    id: 'history',
    icon: BookOpen,
    emoji: '🕰️',
    color: 'from-violet-500 to-violet-700',
    badge: 'Step 2 of 5',
    title: 'My History',
    description:
      'Your agent keeps a timeline of everything it has ever learned about you — reports analyzed, reactions logged, products added, and decisions it made. You can always see and understand its reasoning.',
    tip: '💡 Tap any event to expand the full details.',
    cta: 'Next',
  },
  {
    id: 'chat',
    icon: MessageSquare,
    emoji: '💬',
    color: 'from-sky-500 to-sky-700',
    badge: 'Step 3 of 5',
    title: 'Ask My Agent',
    description:
      '"Why is retinol in my routine?" "Can I use this new serum?" Just ask. Your agent answers based on your actual skin history, reports, and products — not generic advice.',
    tip: '💡 Your agent uses your memory to give personalised answers.',
    cta: 'Next',
  },
  {
    id: 'report',
    icon: FileUp,
    emoji: '📄',
    color: 'from-amber-500 to-amber-700',
    badge: 'Step 4 of 5',
    title: 'Upload a Report',
    description:
      'Got a dermatologist report? Upload it here. Your agent reads it, extracts your diagnosed conditions and recommended ingredients, and uses them to build or update your routine.',
    tip: '💡 The more reports you upload, the smarter your agent gets.',
    cta: 'Next',
  },
  {
    id: 'products',
    icon: ShoppingBag,
    emoji: '🧴',
    color: 'from-rose-500 to-rose-700',
    badge: 'Step 5 of 5',
    title: 'My Products',
    description:
      'Add everything on your shelf here. Your agent checks each product for ingredient conflicts, assigns it a compatibility score, and decides whether to keep it, replace it, or flag it.',
    tip: '💡 Your agent will badge each product: ✅ Keep · ⚠️ Replace · ❌ Conflict.',
    cta: "I'm ready!",
  },
] as const;

type StepId = (typeof STEPS)[number]['id'];

// ─── LocalStorage key ─────────────────────────────────────────────────────────
const LS_KEY = 'routineiq-onboarding-done';

// ─── Hook: control tour ────────────────────────────────────────────────────────
export function useOnboardingTour() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(LS_KEY);
    if (!done) setShow(true);
  }, []);

  const complete = useCallback(() => {
    localStorage.setItem(LS_KEY, 'true');
    setShow(false);
  }, []);

  const restart = useCallback(() => {
    localStorage.removeItem(LS_KEY);
    setShow(true);
  }, []);

  return { show, complete, restart };
}

// ─── Progress dots ────────────────────────────────────────────────────────────

function Dots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Step ${current + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ width: i === current ? 20 : 6, opacity: i <= current ? 1 : 0.35 }}
          transition={{ duration: 0.3 }}
          className="h-1.5 rounded-full bg-white"
        />
      ))}
    </div>
  );
}

// ─── Single step card ─────────────────────────────────────────────────────────

function StepCard({
  step,
  index,
  total,
  onNext,
  onSkip,
}: {
  step: (typeof STEPS)[number];
  index: number;
  total: number;
  onNext: () => void;
  onSkip: () => void;
}) {
  const Icon = step.icon;
  const isLast = index === total - 1;
  const isFirst = index === 0;

  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800">

        {/* ── Gradient header ──────────────────────────────────────────────── */}
        <div className={`bg-gradient-to-br ${step.color} px-6 pt-8 pb-10 relative overflow-hidden`}>
          {/* Decorative blobs */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 blur-xl" />

          {/* Top row: badge + skip */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/70 bg-white/10 px-2.5 py-1 rounded-full">
              {step.badge}
            </span>
            {!isLast && (
              <button
                onClick={onSkip}
                className="text-[11px] font-bold text-white/60 hover:text-white transition flex items-center gap-1"
                aria-label="Skip tour"
              >
                Skip <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Icon / logo */}
          <div className="mb-5">
            {isFirst ? (
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Image src="/icon-192.png" alt="RoutineIQ" width={40} height={40} className="rounded-xl" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                {step.emoji && <span className="text-3xl">{step.emoji}</span>}
              </div>
            )}
          </div>

          <h2 className="font-display font-black text-2xl text-white leading-tight">{step.title}</h2>

          {/* Dots */}
          <div className="mt-4">
            <Dots total={total} current={index} />
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────────── */}
        <div className="px-6 py-6 space-y-5">
          <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {step.description}
          </p>

          {step.tip && (
            <div className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700/40">
              <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">{step.tip}</p>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={onNext}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition
              bg-gradient-to-r ${step.color} text-white hover:opacity-90 active:scale-[0.98] shadow-lg`}
          >
            {isLast ? (
              <>
                <Sparkles className="w-4 h-4" />
                {step.cta}
              </>
            ) : (
              <>
                {step.cta}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main OnboardingTour ──────────────────────────────────────────────────────

interface OnboardingTourProps {
  onComplete: () => void;
}

export default function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [stepIndex, setStepIndex] = useState(0);

  const next = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(i => i + 1);
    } else {
      onComplete();
    }
  };

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'ArrowRight') next();
      if (e.key === 'Escape') onComplete();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Onboarding tour"
    >
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />

      {/* Floating decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-teal-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md z-10">
        <AnimatePresence mode="wait">
          <StepCard
            key={STEPS[stepIndex].id}
            step={STEPS[stepIndex]}
            index={stepIndex}
            total={STEPS.length}
            onNext={next}
            onSkip={onComplete}
          />
        </AnimatePresence>

        {/* Step counter */}
        <p className="text-center text-[11px] text-white/40 mt-4 font-medium">
          {stepIndex + 1} / {STEPS.length} · Press Enter or → to advance
        </p>
      </div>
    </motion.div>
  );
}
