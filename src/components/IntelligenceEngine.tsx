/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Star, CheckCircle, AlertTriangle, HelpCircle, Activity, Info, RefreshCw } from 'lucide-react';
import { recommendedIngredientsList } from '../data';

const INGREDIENT_SYNERGY_MATRIX: Record<string, Record<string, {
  status: 'safe' | 'warning' | 'danger';
  compatibility: number;
  description: string;
}>> = {
  'retinol': {
    'glycolic acid': { status: 'danger', compatibility: 20, description: 'High risk of micro-epidermal peeling and severe inflammation. Avoid using in the same routine window.' },
    'vitamin c (l-ascorbic)': { status: 'warning', compatibility: 55, description: 'Varying pH requirements. Space them apart (Vitamin C in day, Retinol in evening) for safety.' },
    'niacinamide': { status: 'safe', compatibility: 95, description: 'Excellent synergistic combination. Niacinamide strengthens barrier against retinol trans-epidermal moisture loss.' },
    'ceramides': { status: 'safe', compatibility: 99, description: 'Highly restorative combination to replenish lipid layer depleted by high retinoid stimulation.' }
  },
  'vitamin c (l-ascorbic)': {
    'benzoyl peroxide': { status: 'danger', compatibility: 15, description: 'Benzoyl peroxide oxidizes ascorbic acid directly, rendering both inactive and creating dermal redness.' },
    'niacinamide': { status: 'warning', compatibility: 65, description: 'Acidic pH of L-ascorbic can hydrolyze niacinamide into irritating nicotinic acid. Diligently space applications by 15 mins.' },
    'glycolic acid': { status: 'warning', compatibility: 50, description: 'Cumulative peeling effect. May trigger temporary skin sensitization unless user possesses high skin tolerance.' },
    'ceramides': { status: 'safe', compatibility: 98, description: 'Provides cellular repair to support active antioxidant defense systems.' }
  },
  'benzoyl peroxide': {
    'retinol': { status: 'danger', compatibility: 10, description: 'Direct molecular degradation. Benzoyl peroxide deactivates retinol molecules completely in high concentrations.' },
    'glycolic acid': { status: 'danger', compatibility: 30, description: 'Extreme flaking and deep layer dryness. Avoid concurrent use within 24-hour periods.' },
    'niacinamide': { status: 'safe', compatibility: 90, description: 'Niacinamide calms redness induced by benzoyl-peroxide-driven radical generation.' }
  }
};

export default function IntelligenceEngine() {
  const [chemicalA, setChemicalA] = useState('retinol');
  const [chemicalB, setChemicalB] = useState('niacinamide');
  const [result, setResult] = useState<{ status: 'safe' | 'warning' | 'danger'; compatibility: number; description: string } | null>(null);
  const [isMatching, setIsMatching] = useState(false);

  const handleDiagnoseSynergy = async () => {
    setIsMatching(true);
    setResult(null);

    try {
      const res = await fetch('/api/analyze-chemicals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chemicals: [chemicalA, chemicalB] })
      });
      
      if (!res.ok) throw new Error('Analysis failed');
      
      const data = await res.json();
      
      // Map Qwen API format back to the expected internal format
      setResult({
        status: data.status ? data.status.toLowerCase() as 'safe' | 'warning' | 'danger' : 'safe',
        compatibility: data.compatibilityScore || 90,
        description: data.interactions && data.interactions.length > 0 
          ? data.interactions[0].description 
          : data.recommendation || 'No known dynamic chemical conflict found.'
      });
    } catch (err) {
      console.error(err);
      // Fallback
      setResult({
        status: 'safe',
        compatibility: 90,
        description: 'Unable to connect to intelligence engine at this time.'
      });
    } finally {
      setIsMatching(false);
    }
  };

  const handleSelectPreset = (a: string, b: string) => {
    setChemicalA(a);
    setChemicalB(b);
    setResult(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8 pb-12"
    >
      <div>
        <h2 className="font-display font-black text-2xl md:text-3xl text-slate-900 dark:text-white">Formulary Intelligence Matrix</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Scan chemical pairs to instantly audit safe chemical synergies and prevent epidermal damage.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Workspace: Selector inputs */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-xs space-y-5 lg:col-span-1">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-50 dark:border-slate-800">
            <Brain className="w-4 h-4 text-teal-600" />
            Cross-Chemical Analyzer
          </h3>

          <div className="space-y-4">
            {/* Active Chemical A */}
            <div className="space-y-1">
              <label htmlFor="chemical-a" className="text-[11px] font-bold text-slate-400 uppercase">Chemical Ingredient Alpha</label>
              <select
                id="chemical-a"
                value={chemicalA}
                onChange={(e) => { setChemicalA(e.target.value); setResult(null); }}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-teal-500"
              >
                <option value="retinol">Retinol Complex</option>
                <option value="vitamin c (l-ascorbic)">Vitamin C (L-Ascorbic Acid)</option>
                <option value="benzoyl peroxide">Benzoyl Peroxide</option>
                <option value="niacinamide">Niacinamide / B3</option>
                <option value="glycolic acid">Glycolic Acid (AHA)</option>
                <option value="ceramides">Ceramides complex</option>
              </select>
            </div>

            {/* Active Chemical B */}
            <div className="space-y-1">
              <label htmlFor="chemical-b" className="text-[11px] font-bold text-slate-400 uppercase">Chemical Ingredient Beta</label>
              <select
                id="chemical-b"
                value={chemicalB}
                onChange={(e) => { setChemicalB(e.target.value); setResult(null); }}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-teal-500"
              >
                <option value="niacinamide">Niacinamide / B3</option>
                <option value="retinol">Retinol Complex</option>
                <option value="benzoyl peroxide">Benzoyl Peroxide</option>
                <option value="glycolic acid">Glycolic Acid (AHA)</option>
                <option value="ceramides">Ceramides complex</option>
                <option value="vitamin c (l-ascorbic)">Vitamin C (L-Ascorbic Acid)</option>
              </select>
            </div>

            <button
              onClick={handleDiagnoseSynergy}
              disabled={chemicalA === chemicalB || isMatching}
              className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-bold rounded-xl uppercase transition cursor-pointer"
            >
              {isMatching ? 'Consulting Chemical Codex...' : 'Check Molecular Match'}
            </button>

            {chemicalA === chemicalB && (
              <p className="text-[10px] text-red-500 text-center font-medium">Please select two distinct ingredients.</p>
            )}
          </div>

          {/* Quick presets list */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="block text-[11px] font-bold text-slate-400 uppercase">Interactive Diagnostics Presets</span>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <button 
                onClick={() => handleSelectPreset('retinol', 'glycolic acid')}
                className="px-2 py-1.5 bg-red-50 dark:bg-red-950/20 text-red-700 rounded-lg text-left truncate cursor-pointer font-medium"
              >
                Retinol + Glycolic
              </button>
              <button 
                onClick={() => handleSelectPreset('vitamin c (l-ascorbic)', 'benzoyl peroxide')}
                className="px-2 py-1.5 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-805 rounded-lg text-left truncate cursor-pointer font-medium"
              >
                Vit C + Benzol
              </button>
              <button 
                onClick={() => handleSelectPreset('retinol', 'niacinamide')}
                className="px-2 py-1.5 bg-green-50 dark:bg-green-950/20 text-green-700 rounded-lg text-left truncate cursor-pointer font-medium"
              >
                Retinol + Niacin
              </button>
              <button 
                onClick={() => handleSelectPreset('vitamin c (l-ascorbic)', 'ceramides')}
                className="px-2 py-1.5 bg-teal-50 dark:bg-teal-950/20 text-teal-700 rounded-lg text-left truncate cursor-pointer font-medium"
              >
                Vit C + Ceramides
              </button>
            </div>
          </div>
        </div>

        {/* Outcome Match details & Recommended substances */}
        <div className="lg:col-span-2 space-y-6">

          {/* Matches Output Box */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-xs min-h-[180px] flex flex-col justify-between">
            <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Synergy Evaluation Result</span>

            <AnimatePresence>
              {isMatching && (
                <div className="py-8 flex flex-col items-center justify-center space-y-2" aria-live="polite">
                  <RefreshCw className="w-8 h-8 text-teal-600 animate-spin" />
                  <span className="text-xs font-mono text-slate-400">Comparing biochemical attributes...</span>
                </div>
              )}

              {!isMatching && !result && (
                <div className="py-10 text-center text-slate-400 dark:text-slate-500 italic">
                  No active query. Select ingredients on the sidebar and initiate intelligence match above.
                </div>
              )}

              {!isMatching && result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4 pt-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {result.status === 'safe' && <CheckCircle className="w-5 h-5 text-teal-600 shrink-0" />}
                      {result.status === 'warning' && <Info className="w-5 h-5 text-yellow-500 shrink-0" />}
                      {result.status === 'danger' && <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />}
                      <span className="font-display font-extrabold text-slate-800 dark:text-white capitalize">
                        {chemicalA} + {chemicalB}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">Synergy Score:</span>
                      <span className={`font-mono font-black text-lg 
                        ${result.status === 'safe' ? 'text-teal-700 dark:text-teal-400' : result.status === 'warning' ? 'text-yellow-600' : 'text-red-500'}`}>
                        {result.compatibility}%
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                    {result.description}
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Recommended Action:</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full
                      ${result.status === 'safe' 
                        ? 'bg-teal-50 text-teal-800' 
                        : result.status === 'warning' 
                          ? 'bg-yellow-50 text-yellow-800' 
                          : 'bg-red-50 text-red-800'
                      }`}
                    >
                      {result.status === 'safe' ? 'Fully Permitted' : result.status === 'warning' ? 'Space Applications' : 'Contraindicated Selection'}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Recommended ingredients list */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="font-semibold text-slate-950 dark:text-white text-sm">Suggested Clinical Alternatives</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Dermatological replacement candidates offering safe biological pathways</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4" role="list">
              {recommendedIngredientsList.map((ing, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between" role="listitem">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider
                        ${ing.role === 'Primary' 
                          ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-350' 
                          : ing.role === 'Restorative'
                            ? 'bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-350'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-350'
                        }`}
                      >
                        {ing.role}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-xs text-slate-850 dark:text-slate-200">{ing.name}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{ing.description}</p>
                  </div>
                  
                  <div className="mt-4 pt-2.5 border-t border-slate-200/40 dark:border-slate-900 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> High Stability
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
