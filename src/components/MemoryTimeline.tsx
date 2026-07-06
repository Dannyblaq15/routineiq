'use client';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, Package, RefreshCw, AlertTriangle,
  Sparkles, Brain, Activity, ChevronDown, ChevronUp,
  Clock, Filter
} from 'lucide-react';
import { AgentEpisode, EpisodeType } from '../types';

// ─── Mock episode data ────────────────────────────────────────────────────────

// No mock data - fetching from API

// ─── Filter config ─────────────────────────────────────────────────────────

type FilterKey = 'all' | 'reports' | 'products' | 'routines' | 'reactions' | 'agent';

const FILTERS: { key: FilterKey; label: string; types: EpisodeType[] }[] = [
  { key: 'all', label: 'All', types: [] },
  { key: 'reports', label: 'Reports', types: ['report_uploaded', 'report_analyzed'] },
  { key: 'products', label: 'Products', types: ['product_added', 'product_removed'] },
  { key: 'routines', label: 'Routines', types: ['routine_created', 'routine_updated'] },
  { key: 'reactions', label: 'Reactions', types: ['reaction_logged'] },
  { key: 'agent', label: 'Agent', types: ['agent_decision', 'agent_alert', 'agent_learning', 'preference_updated'] },
];

// ─── Episode icon + style config ─────────────────────────────────────────────

const EPISODE_CONFIG: Record<EpisodeType, {
  icon: React.ReactNode;
  dotColor: string;
  badgeClass: string;
  badgeLabel: string;
}> = {
  report_uploaded: { icon: <FileText className="w-4 h-4" />, dotColor: 'bg-blue-500', badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300', badgeLabel: 'Report' },
  report_analyzed: { icon: <FileText className="w-4 h-4" />, dotColor: 'bg-blue-500', badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300', badgeLabel: 'Report Analyzed' },
  routine_created: { icon: <RefreshCw className="w-4 h-4" />, dotColor: 'bg-teal-500', badgeClass: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300', badgeLabel: 'Routine Created' },
  routine_updated: { icon: <RefreshCw className="w-4 h-4" />, dotColor: 'bg-teal-500', badgeClass: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300', badgeLabel: 'Routine Updated' },
  product_added: { icon: <Package className="w-4 h-4" />, dotColor: 'bg-violet-500', badgeClass: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300', badgeLabel: 'Product Added' },
  product_removed: { icon: <Package className="w-4 h-4" />, dotColor: 'bg-rose-500', badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300', badgeLabel: 'Product Removed' },
  reaction_logged: { icon: <AlertTriangle className="w-4 h-4" />, dotColor: 'bg-amber-500', badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300', badgeLabel: 'Reaction' },
  preference_updated: { icon: <Brain className="w-4 h-4" />, dotColor: 'bg-purple-500', badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300', badgeLabel: 'Preference Learned' },
  agent_decision: { icon: <Sparkles className="w-4 h-4" />, dotColor: 'bg-teal-600', badgeClass: 'bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200', badgeLabel: 'Agent Decision' },
  agent_alert: { icon: <Activity className="w-4 h-4" />, dotColor: 'bg-sky-500', badgeClass: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300', badgeLabel: 'Agent Alert' },
  agent_learning: { icon: <Brain className="w-4 h-4" />, dotColor: 'bg-purple-500', badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300', badgeLabel: 'Agent Learning' },
};

// ─── Utility ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function getMonthLabel(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

function groupByMonth(episodes: AgentEpisode[]): { month: string; items: AgentEpisode[] }[] {
  const map = new Map<string, AgentEpisode[]>();
  for (const ep of episodes) {
    const month = getMonthLabel(ep.occurredAt);
    if (!map.has(month)) map.set(month, []);
    map.get(month)!.push(ep);
  }
  return Array.from(map.entries()).map(([month, items]) => ({ month, items }));
}

// ─── Episode Card ─────────────────────────────────────────────────────────────

function EpisodeCard({ episode, index }: { episode: AgentEpisode; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const config = EPISODE_CONFIG[episode.episodeType];

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="relative pl-9"
    >
      {/* Timeline dot */}
      <div className={`absolute left-0 top-4 w-3 h-3 rounded-full border-2 border-white dark:border-slate-950 ${config.dotColor} shadow-sm z-10`} />
      {/* Vertical line (drawn by parent) */}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-xs overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={`p-2 rounded-lg shrink-0 ${config.badgeClass}`}>
              {config.icon}
            </div>

            <div className="flex-1 min-w-0">
              {/* Badge + time */}
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.badgeClass}`}>
                  {config.badgeLabel}
                </span>
                {episode.agentId && (
                  <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <Brain className="w-2.5 h-2.5" />
                    {episode.agentId.replace(/-agent$/, '').replace(/-/g, ' ')}
                  </span>
                )}
              </div>

              {/* Title */}
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">{episode.title}</p>

              {/* Time */}
              <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                <Clock className="w-2.5 h-2.5" />
                {formatDate(episode.occurredAt)} · {formatTime(episode.occurredAt)}
              </div>
            </div>

            {/* Expand toggle */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="shrink-0 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
              aria-label={expanded ? 'Collapse episode detail' : 'Expand episode detail'}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Expandable summary */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{episode.summary}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MemoryTimeline() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [episodes, setEpisodes] = useState<AgentEpisode[]>([]);

  useEffect(() => {
    fetch('/api/memory')
      .then(res => res.json())
      .then(data => {
        if (data && data.episodes) {
          setEpisodes(data.episodes);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const filtered = activeFilter === 'all'
    ? episodes
    : episodes.filter(ep => FILTERS.find(f => f.key === activeFilter)!.types.includes(ep.episodeType));

  const grouped = groupByMonth(filtered);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 pb-12"
    >
      {/* Header */}
      <div className="space-y-1">
        <h2 className="font-display font-black text-2xl text-slate-900 dark:text-white flex items-center gap-2">
          <Brain className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          Memory Timeline
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Everything your agent remembers · {episodes.length} events
        </p>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all ${
              activeFilter === f.key
                ? 'bg-teal-700 dark:bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-8"
        >
          {grouped.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Brain className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No episodes in this category yet.</p>
            </div>
          )}

          {grouped.map(({ month, items }) => (
            <div key={month} className="space-y-3">
              {/* Month divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700/60" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{month}</span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700/60" />
              </div>

              {/* Episode cards with vertical line */}
              <div className="relative space-y-3">
                {/* Vertical connector line */}
                <div className="absolute left-[5px] top-5 bottom-5 w-px bg-slate-200 dark:bg-slate-700/60" />

                {items.map((ep, idx) => (
                  <EpisodeCard key={ep.id} episode={ep} index={idx} />
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
