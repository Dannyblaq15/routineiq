/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Microscope, Brain, Upload, Sparkles, CheckCircle, AlertTriangle, Play, RefreshCw, FileText, X } from 'lucide-react';
import { PatientAnalysis } from '../types';

interface ReportAnalysisProps {
  onAddAnalysis: (analysis: PatientAnalysis) => void;
  onNavigate?: (screen: ScreenType) => void;
}

const PRESETS = [
  {
    name: "Dr. Vos - Barrier Restorative Directive",
    text: `PATIENT DIAGNOSIS: Atopic Epidermal Barrier Degradation (Severe Redness)
RECOMMENDED SUBSTANCES:
- Ceramides (NP, AP, EOP) at 2.5% daily
- Hyaluronic Acid 2% (ph 5.5) for hydration
- Azelaic Acid 15% (for micro-inflammation)
STRICT CONFLICTS REPORTED: Eliminate L-Ascorbic Acid and Benzoyl Peroxide during active barrier phase`
  },
  {
    name: "Post-Laser Renewal Protocol",
    text: `PATIENT DIAGNOSIS: Post-Laser Erythema & Solar Hyperpigmentation
INDICATED MOLECULES:
- Pure Vitamin C (L-Ascorbic) 10% morning phase
- Centella Asiatica 4% morning/evening
- Avoid direct Retinoids until epidermis layer is fully re-epithelialized (approx 14 days)`
  },
  {
    name: "Acne Vulgaris Moderate Control",
    text: `PATIENT DIAGNOSIS: Acne Vulgaris Grade II with Sebaceous Hyperplasia
RECOMMENDED ROUTINE:
- Benzoyl Peroxide 5% treatment (PM only)
- Retinol 1% Complex (every second PM)
- Squalane based non-comedogenic hydration
WARNING: Do not combine Benzoyl Peroxide with Retinol in the same application window`
  }
];

import { ScreenType } from '../types';

export default function ReportAnalysis({ onAddAnalysis, onNavigate }: ReportAnalysisProps) {
  const [inputText, setInputText] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [analysisSteps, setAnalysisSteps] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<{
    diagnosis: string;
    substances: string[];
    conflicts: string[];
    severity: 'High' | 'Medium' | 'Low';
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processUploadedFile = async (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isText = file.type === 'text/plain' || file.name.endsWith('.txt');

    if (isText) {
      setUploadedImage(null);
      try {
        const text = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsText(file);
        });
        setInputText(text);
      } catch (err) {
        console.error('Error reading text file:', err);
      }
    } else if (isImage) {
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        setUploadedImage(base64);
        setInputText(`[IMAGE CLINICAL REPORT UPLOADED: ${file.name}]`);
      } catch (err) {
        console.error('Error reading image file:', err);
      }
    } else {
      setUploadedImage(null);
      setInputText(`[DOCUMENT UPLOADED: ${file.name}]\nPlease type or paste your clinical report text here to proceed with analysis.`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processUploadedFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleApplyPreset = (presetText: string) => {
    setUploadedImage(null);
    setInputText(presetText);
    setOutcome(null);
  };

  const handleExecuteAnalysis = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setOutcome(null);
    setAnalysisSteps([]);

    const steps = [
      "Initializing AI Bio-Informatics OCR Streamer...",
      "Extracting molecular substances and structural terminology...",
      "Cross-referencing global chemical contraindication database...",
      "Calculating epidermal pH tolerance compatibility...",
      "Generating diagnostic clinical RoutineIQ profile..."
    ];

    // Start UI animation steps without blocking the fetch
    const stepsPromise = (async () => {
      for (let i = 0; i < steps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 700));
        setAnalysisSteps((prev) => [...prev, steps[i]]);
      }
    })();

    try {
      const res = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reportText: inputText,
          image: uploadedImage
        })
      });
      
      if (!res.ok) {
        const errText = await res.text();
        console.error("Backend Error Response:", errText);
        throw new Error('Analysis failed: ' + errText);
      }
      
      const data = await res.json();
      
      // Wait for UI steps to finish at least partially so it looks good
      await stepsPromise;
      
      setOutcome({
        diagnosis: data.diagnosis || 'Unknown Diagnosis',
        substances: data.substances || [],
        conflicts: data.conflicts || [],
        severity: data.severity || 'Medium',
      });
      
      if (data.diagnosis) {
        onAddAnalysis({
          id: `#RD-${Math.floor(4000 + Math.random() * 1000)}-S`,
          type: data.diagnosis,
          clinician: "Dr. Aris (AI Analyst)",
          status: "COMPLETE",
          severity: data.severity || 'Medium',
          date: "Today"
        });

        // Log to memory timeline
        try {
          await fetch('/api/memory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'add_episode',
              payload: {
                episodeType: 'report_analyzed',
                title: 'Clinical Report Extracted',
                summary: `Extracted: ${data.diagnosis}. Substances identified: ${(data.substances || []).join(', ')}.`,
                relatedEntityType: 'report',
                agentId: 'report-ingestion-agent',
                isVisibleToUser: true,
              }
            })
          });
        } catch (err) {
          console.error('Failed to log report to memory:', err);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8 pb-12"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-2xl md:text-3xl text-slate-900 dark:text-white">Clinical Report Extractor</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Perform sub-molecular extraction using our OCR analyzer.</p>
        </div>
      </div>

      {/* Preset Suggestions Row */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Preset Sample Diagnoses</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset.text)}
              className="p-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-xl hover:border-teal-500 dark:hover:border-teal-400 hover:shadow-xs transition text-left cursor-pointer"
            >
              <h4 className="font-bold text-xs text-teal-800 dark:text-teal-300 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                {preset.name.split(" - ")[0]}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {preset.text}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Extractor Workspace */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Left Side: Upload Zone and Input Box */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs space-y-5">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-teal-600" />
            Directive Feed Source
          </h3>

          {/* Drag & Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
            className={`cursor-pointer group border-2 border-dashed rounded-xl p-6 text-center transition
              ${dragActive 
                ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-950/20' 
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40'
              }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".txt,.pdf,.jpg,.png,.jpeg"
              aria-label="Upload clinical report file"
            />
            <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto group-hover:scale-110 transition" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">
              Drag & Drop Report Here, or <span className="text-teal-700 dark:text-teal-400 hover:underline">Select File</span>
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Supports PDF, PNG, JPG, or TXT formats</p>
          </div>

          {uploadedImage && (
            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200/60 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
              <img src={uploadedImage} alt="Uploaded report preview" className="h-full w-auto object-contain" />
              <button
                type="button"
                onClick={() => {
                  setUploadedImage(null);
                  setInputText('');
                }}
                className="absolute top-2 right-2 p-1 bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-400 rounded-full hover:bg-red-100 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="script-input" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Or Paste Dermatological Script Text
            </label>
            <textarea
              id="script-input"
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. PATIENT PROTOCOL: Apply Retinol 1.0% once daily at night. Keep barrier integrity high with moisturising cream..."
              className="w-full text-xs font-mono p-3 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            onClick={handleExecuteAnalysis}
            disabled={!inputText.trim() || isAnalyzing}
            className="w-full py-3 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Synthesizing Bioactive Formulas...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Proceed with Intelligence Parse
              </>
            )}
          </button>
        </div>

        {/* Right Side: Step logs & Extracted Bio-Outcome Card */}
        <div className="bg-slate-55 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-850 shadow-xs flex flex-col justify-between min-h-[350px]">
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Brain className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Extraction Pipeline Monitor
            </h3>

            {/* Pipeline progress logs */}
            <div className="mt-4 space-y-2 max-h-[160px] overflow-y-auto" aria-live="polite">
              {analysisSteps.map((step, sIdx) => (
                <div key={sIdx} className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-350">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="font-mono">{step}</span>
                </div>
              ))}
              {isAnalyzing && (
                <div className="flex items-center gap-2 text-[11px] text-teal-500 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                  <span className="font-bold">Analyzing biological indicators...</span>
                </div>
              )}
              {!isAnalyzing && analysisSteps.length === 0 && (
                <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-6 text-center">
                  Awaiting script input. Feed source data to launch bio-informatics streamer.
                </p>
              )}
            </div>
          </div>

          {/* Parsed Outcome Card */}
          <AnimatePresence>
            {outcome && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-6 p-4 bg-white dark:bg-slate-950 rounded-xl border border-teal-500/20 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-teal-55 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    Successful Diagnostic Extract
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase
                    ${outcome.severity === 'High' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-800'}`}>
                    {outcome.severity} Hazard
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-slate-850 dark:text-slate-200">{outcome.diagnosis}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Categorized in local Patient Database</p>
                </div>

                <div className="space-y-1.5">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Biological Target Molecules:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {outcome.substances.map((sub, idx) => (
                      <span key={idx} className="bg-slate-51 text-slate-700 dark:bg-slate-800 dark:text-slate-250 text-[10px] font-semibold px-2 py-0.5 rounded">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {outcome.conflicts.length > 0 && (
                  <div className="bg-red-50/60 dark:bg-red-950/20 p-2.5 rounded-lg border border-red-500/10 space-y-1">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-red-700 dark:text-red-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Contraindications Detected
                    </span>
                    <ul className="text-[10px] list-disc list-inside text-slate-600 dark:text-slate-350 space-y-0.5">
                      {outcome.conflicts.map((conf, idx) => (
                        <li key={idx}>{conf}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {onNavigate && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2.5">
                    <button
                      onClick={() => onNavigate('inventory')}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold py-1.5 px-2 rounded-lg cursor-pointer text-center transition"
                    >
                      Step 2: Add Products →
                    </button>
                    <button
                      onClick={() => onNavigate('agent-dashboard')}
                      className="flex-1 bg-teal-700 hover:bg-teal-800 text-white text-[10px] font-bold py-1.5 px-2 rounded-lg cursor-pointer text-center transition"
                    >
                      Step 3: Go to Dashboard →
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
}
