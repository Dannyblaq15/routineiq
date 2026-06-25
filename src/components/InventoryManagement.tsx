/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, ShieldCheck, AlertCircle, Trash, Plus, Sparkles, Filter, Check, Search, X, Tag } from 'lucide-react';
import { InventoryItem } from '../types';

interface InventoryManagementProps {
  items: InventoryItem[];
  onAddItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
}

const DEFAULT_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA3yhQUPqFFq9nwIKSK6vuyb6zzafOOWaK3DDKathEDMrD13VgAntBphmmh8f1ZgkEHu9NNT55EqvyWy_7WvcpdBVrSesgbWDJdsAj7KPDV8YQeLUHH39xcxvWLYpk1cuyF-Hw5z1CMon_Oxfm9Y7ohgeGZFm7XCVl5IqglePR7iy3bnxSH3H_QUxwU4A26tqTwZM6jZ6bUJfPePH4Op-lxJxyFnRymsiWGVm5Soyh4t3sZf-cm9lhtnp2fLdPOTwvVCNUOFRXWWwg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB82ngfTOv462He8e3wHvEE9NPO3syFzdkpQNhQwW87X1qwSCtXpeYFJJt3ev_ZDnPmoG3ghgjpSaTzbF3gT41p4NWhEIhe1udzTTCbIJWXKNVvK58ER_7-MLHXvsrvvQUvlMl6gTjHdtcIYBo9kRfSgn8IMmrHGBYWx3rbGv0_ZF-G0-_TMXSrhz1o-51TSQMcxSZQAb1CXTv_YZsko9qeuRmB84Imdud_7YniEIpJWRMdVydMk2t9-ArkDTKeP4HCzjmFFQun6d4',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAgM-UVa6D5pfNagUCHhENPP_jD1gj8qnjFHm93UVC7N1zISJSUDrKoKA-OmJjZEIDesOwz7k8XkbFDzOG-4GM_5932ocpxGxjSumj01YnnokNyHeVQh0ZavcQt6WC3-tV9HrVc5-_RHf2azEFtbRXj0BIEZhq1ZYQ3PzG6s4yKTNkw24oGMuV9PPwwRIQUEOf5y3Ilz1-NM1z3OhazLdmNNScJ-QmluKwYN2fOMJrsqXs-A8RgVA8WWBPIFCYdcu3fzt9gCe9hak'
];

export default function InventoryManagement({ items, onAddItem, onDeleteItem }: InventoryManagementProps) {
  const [name, setName] = useState('');
  const [phase, setPhase] = useState('Treatment Phase');
  const [category, setCategory] = useState('Serum');
  const [compatibility, setCompatibility] = useState(85);
  const [rawTags, setRawTags] = useState('');
  const [statusText, setStatusText] = useState('12 Months Left');
  const [statusType, setStatusType] = useState<'success' | 'warning' | 'error' | 'normal'>('success');
  const [phaseFilter, setPhaseFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedTags = rawTags.split(',').map((t) => t.trim()).filter(Boolean);
    const randomImage = DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)];

    const newItem: InventoryItem = {
      id: `prod-${Math.floor(Number(performance.now()) + Math.random() * 1000)}`,
      name,
      phase,
      category,
      compatibility: Number(compatibility),
      tags: parsedTags.length ? parsedTags : ['Hyaluronic', 'Organic'],
      statusText,
      statusType,
      imageUrl: randomImage
    };

    onAddItem(newItem);
    setName('');
    setRawTags('');
    setCategory('Serum');
    setStatusText('12 Months Left');
    setStatusType('success');
  };

  // Unique phases for filter options
  const phasesList = ['All', ...Array.from(new Set(items.map((i) => i.phase)))];

  // Common skincare categories
  const categoriesList = ['All', 'Serum', 'Moisturizer', 'Cleanser', 'Toner', 'Sunscreen', 'Treatment'];

  const filteredItems = items.filter((item) => {
    const matchesPhase = phaseFilter === 'All' || item.phase === phaseFilter;
    const matchesCategory = categoryFilter === 'All' || (item.category || 'Serum') === categoryFilter;
    const matchesSearch = !searchTerm.trim() || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      ((item.category || 'Serum').toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.phase.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPhase && matchesCategory && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8 pb-12"
    >
      <div>
        <h2 className="font-display font-black text-2xl md:text-3xl text-slate-900 dark:text-white">Formulary Inventory Manager</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Register active products, audit molecular shelf lifespan, and run molecular compatibility matrix tests.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Drawer Column: Register Item form */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs space-y-4 h-fit">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-50 dark:border-slate-800">
            <Plus className="w-4 h-4 text-teal-600" />
            Add Formulary Item
          </h3>

          <form onSubmit={handleAddNewItem} className="space-y-4">
            {/* Name */}
            <div className="space-y-1">
              <label htmlFor="prod-name" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Product Name</label>
              <input
                id="prod-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Niacinamide 10% Drops"
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Treatment Phase */}
            <div className="space-y-1">
              <label htmlFor="prod-phase" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Application Phase</label>
              <select
                id="prod-phase"
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="Cleansing Phase">Cleansing Phase</option>
                <option value="Hydration Phase">Hydration Phase</option>
                <option value="Treatment Phase">Treatment Phase</option>
                <option value="Prevention Phase">Prevention Phase</option>
                <option value="Suncare Phase">Solar/Suncare Phase</option>
              </select>
            </div>

            {/* Skincare Category */}
            <div className="space-y-1">
              <label htmlFor="prod-category" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Skincare Category</label>
              <select
                id="prod-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="Serum">Serum</option>
                <option value="Moisturizer">Moisturizer</option>
                <option value="Cleanser">Cleanser</option>
                <option value="Toner">Toner</option>
                <option value="Sunscreen">Sunscreen</option>
                <option value="Treatment">Treatment</option>
              </select>
            </div>

            {/* Bio compatibility slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Bio Compatibility</label>
                <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400">{compatibility}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={compatibility}
                onChange={(e) => setCompatibility(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer outline-none accent-teal-700"
              />
            </div>

            {/* Tags (comma separated) */}
            <div className="space-y-1">
              <label htmlFor="prod-tags" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Active Ingredients</label>
              <input
                id="prod-tags"
                type="text"
                value={rawTags}
                onChange={(e) => setRawTags(e.target.value)}
                placeholder="Niacinamide, B5, ZincPCA (separated by commas)"
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Lifespan Alert Status */}
            <div className="space-y-1">
              <label htmlFor="prod-lifespan" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Shelf Expiration Alert</label>
              <input
                id="prod-lifespan"
                type="text"
                value={statusText}
                onChange={(e) => setStatusText(e.target.value)}
                placeholder="e.g. 18 Months Left"
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Lifespan Type alert */}
            <div className="space-y-1">
              <label htmlFor="prod-status-type" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Shelf Warning Level</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(['success', 'normal', 'warning', 'error'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setStatusType(t)}
                    className={`p-1.5 rounded-lg text-[10px] font-bold uppercase transition cursor-pointer text-center border
                      ${statusType === t 
                        ? 'bg-teal-50 border-teal-600 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300' 
                        : 'bg-slate-50 dark:bg-slate-850/50 border-slate-100 dark:border-slate-800 text-slate-500'
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-xl uppercase transition cursor-pointer"
            >
              Add to Inventory Registry
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Registered items listing & search triggers */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Advanced Search & Dual Filter Control Tower */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs space-y-4">
            
            {/* Search Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 dark:text-slate-505" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products by name, phase, ingredients or categories..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/80 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 cursor-pointer"
                  aria-label="Clear search input"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filters Row */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-3.5">
              
              {/* Row 1: Application Phase Filter */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                <div className="flex items-center gap-1.5 shrink-0 min-w-[110px] pt-1">
                  <Filter className="w-3.5 h-3.5 text-teal-600/80" />
                  <span className="text-[11px] font-bold text-slate-450 dark:text-slate-200 uppercase tracking-wider">By Phase:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {phasesList.map((ph) => (
                    <button
                      key={ph}
                      onClick={() => setPhaseFilter(ph)}
                      className={`px-2.5 py-1 text-[11px] rounded-lg cursor-pointer transition-all duration-150
                        ${phaseFilter === ph 
                          ? 'bg-teal-700 text-white font-semibold shadow-xs' 
                          : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                    >
                      {ph}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 2: Skincare Category Filter */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 pt-1">
                <div className="flex items-center gap-1.5 shrink-0 min-w-[110px] pt-1">
                  <Tag className="w-3.5 h-3.5 text-teal-600/80" />
                  <span className="text-[11px] font-bold text-slate-450 dark:text-slate-200 uppercase tracking-wider">By Category:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-2.5 py-1 text-[11px] rounded-lg cursor-pointer transition-all duration-150
                        ${categoryFilter === cat 
                          ? 'bg-teal-700 text-white font-semibold shadow-xs' 
                          : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Results metadata tally */}
            <div className="pt-2 flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 border-t border-slate-50 dark:border-slate-800/40">
              <span>ACTIVE CLINICAL INVENTORY</span>
              <span>
                Found {filteredItems.length} of {items.length} product{items.length !== 1 ? 's' : ''}
              </span>
            </div>

          </div>

          {/* List transition container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredItems.map((item) => {
                const isExcellent = item.compatibility >= 90;
                const isModerate = item.compatibility >= 70 && item.compatibility < 90;

                return (
                  <motion.div
                    key={item.id}
                    layoutId={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 hover:shadow-md transition overflow-hidden flex flex-col justify-between"
                  >
                    {/* Upper layout */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2.5">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 object-cover rounded-xl border border-slate-100 dark:border-slate-800 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap gap-1">
                            <span className="text-[9px] font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 px-1.5 py-0.5 rounded uppercase block w-fit">
                              {item.category || 'Serum'}
                            </span>
                            <span className="text-[9px] font-bold bg-slate-50 dark:bg-slate-800 dark:text-slate-400 text-slate-500 px-1.5 py-0.5 rounded uppercase block w-fit">
                              {item.phase}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-850 dark:text-white text-[13px] md:text-sm mt-1.5 truncate" title={item.name}>
                            {item.name}
                          </h4>
                        </div>

                        {/* Expiration warning level badges */}
                        <div className="text-right">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block
                            ${item.statusType === 'error' 
                              ? 'bg-red-55 dark:bg-red-950/40 text-red-700' 
                              : item.statusType === 'warning'
                                ? 'bg-yellow-55 dark:bg-yellow-950/40 text-yellow-700'
                                : 'bg-green-55 dark:bg-green-950/40 text-green-700'
                            }`}
                          >
                            {item.statusText}
                          </span>
                        </div>
                      </div>

                      {/* Compatibility Index */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-450 dark:text-slate-400">Biological Compatibility:</span>
                          <span className={`font-mono font-bold ${isExcellent ? 'text-teal-700 dark:text-teal-400' : isModerate ? 'text-yellow-600' : 'text-red-500'}`}>
                            {item.compatibility}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300
                              ${isExcellent 
                                ? 'bg-teal-700' 
                                : isModerate 
                                  ? 'bg-yellow-500' 
                                  : 'bg-red-500'
                              }`}
                            style={{ width: `${item.compatibility}%` }}
                          />
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tg, idx) => (
                          <span key={idx} className="bg-slate-50 dark:bg-slate-800 text-slate-650 dark:text-slate-350 text-[9px] font-semibold px-2 py-0.5 rounded">
                            {tg}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Lower actions bar */}
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-50 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                        <Check className="w-3.5 h-3.5 text-teal-600" /> Auto Monitor active
                      </span>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                        aria-label={`Delete item ${item.name} from clinical list`}
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredItems.length === 0 && (
              <div className="col-span-2 py-16 text-center text-slate-400 dark:text-slate-500 italic bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                No inventory item matched the designated filter. Add a new item on the panel.
              </div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
