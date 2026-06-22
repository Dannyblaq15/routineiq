/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PatientAnalysis, InventoryItem, RecommendedIngredient, PricingPlan, Testimonial, ComparisonMetric } from './types';

export const recentAnalysesList: PatientAnalysis[] = [
  { id: '#RD-4902-X', type: 'Epidermal Sweep', clinician: 'Dr. Aris (AI)', status: 'COMPLETE', severity: 'High', date: 'Oct 24, 2026' },
  { id: '#RD-4891-B', type: 'Barrier Integrity', clinician: 'Automated', status: 'PENDING', severity: 'Medium', date: 'Oct 23, 2026' },
  { id: '#RD-4855-S', type: 'Cost Efficiency Log', clinician: 'Financial Core', status: 'COMPLETE', severity: 'Low', date: 'Oct 19, 2026' },
  { id: '#RD-4712-Q', type: 'Conflict Detection', clinician: 'Dr. Aris (AI)', status: 'COMPLETE', severity: 'High', date: 'Oct 15, 2026' },
];

export const inventoryItemsList: InventoryItem[] = [
  {
    id: 'prod-1',
    name: 'Retinol 1% Complex',
    phase: 'Treatment Phase',
    category: 'Serum',
    compatibility: 94,
    tags: ['Retinol', 'Squalane', 'Ceramides'],
    statusText: 'Expiring Soon',
    statusType: 'error',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3yhQUPqFFq9nwIKSK6vuyb6zzafOOWaK3DDKathEDMrD13VgAntBphmmh8f1ZgkEHu9NNT55EqvyWy_7WvcpdBVrSesgbWDJdsAj7KPDV8YQeLUHH39xcxvWLYpk1cuyF-Hw5z1CMon_Oxfm9Y7ohgeGZFm7XCVl5IqglePR7iy3bnxSH3H_QUxwU4A26tqTwZM6jZ6bUJfPePH4Op-lxJxyFnRymsiWGVm5Soyh4t3sZf-cm9lhtnp2fLdPOTwvVCNUOFRXWWwg'
  },
  {
    id: 'prod-2',
    name: 'Hyaluronic Hydra',
    phase: 'Hydration Phase',
    category: 'Moisturizer',
    compatibility: 99,
    tags: ['HA 2%', 'B5'],
    statusText: '14 Months Left',
    statusType: 'success',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB82ngfTOv462He8e3wHvEE9NPO3syFzdkpQNhQwW87X1qwSCtXpeYFJJt3ev_ZDnPmoG3ghgjpSaTzbF3gT41p4NWhEIhe1udzTTCbIJWXKNVvK58ER_7-MLHXvsrvvQUvlMl6gTjHdtcIYBo9kRfSgn8IMmrHGBYWx3rbGv0_ZF-G0-_TMXSrhz1o-51TSQMcxSZQAb1CXTv_YZsko9qeuRmB84Imdud_7YniEIpJWRMdVydMk2t9-ArkDTKeP4HCzjmFFQun6d4'
  },
  {
    id: 'prod-3',
    name: 'Pure Vitamin C',
    phase: 'Prevention Phase',
    category: 'Serum',
    compatibility: 42,
    tags: ['L-Ascorbic', 'Ferulic'],
    statusText: 'Conflict Alert',
    statusType: 'warning',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgM-UVa6D5pfNagUCHhENPP_jD1gj8qnjFHm93UVC7N1zISJSUDrKoKA-OmJjZEIDesOwz7k8XkbFDzOG-4GM_5932ocpxGxjSumj01YnnokNyHeVQh0ZavcQt6WC3-tV9HrVc5-_RHf2azEFtbRXj0BIEZhq1ZYQ3PzG6s4yKTNkw24oGMuV9PPwwRIQUEOfP5y3Ilz1-NM1z3OhazLdmNNScJ-QmluKwYN2fOMJrsqXs-A8RgVA8WWBPIFCYdcu3fzt9gCe9hak'
  }
];

export const recommendedIngredientsList: RecommendedIngredient[] = [
  {
    name: 'Azelaic Acid 15%',
    role: 'Primary',
    description: 'Topical dicarboxylic acid for redness reduction and microbial control.',
    iconName: 'science'
  },
  {
    name: 'Ceramides (NP, AP, EOP)',
    role: 'Restorative',
    description: 'Bio-identical lipid complex to restore stratum corneum integrity.',
    iconName: 'water_drop'
  },
  {
    name: 'Centella Asiatica',
    role: 'Secondary',
    description: 'Botanical extract targeting micro-inflammation pathways.',
    iconName: 'spa'
  }
];

export const pricingPlansList: PricingPlan[] = [
  {
    name: 'Standard',
    price: '$0',
    period: '/month',
    description: 'For enthusiasts starting their clinical journey.',
    features: ['Ingredient Scanner', 'Conflict Library'],
    isPopular: false,
    colorBorder: 'bg-slate-400'
  },
  {
    name: 'Clinical',
    price: '$12',
    period: '/month',
    description: 'For serious users targeting specific skin conditions.',
    features: ['Report OCR Processing', 'Automated Substitutions', 'Advanced pH Analysis'],
    isPopular: true,
    colorBorder: 'bg-teal-600'
  }  ,
  {
    name: 'Enterprise',
    price: 'Contact',
    period: '',
    description: 'For clinics, medical groups, and R&D labs.',
    features: ['Clinic Dashboard', 'Custom API Access', 'HIPAA Compliance'],
    isPopular: false,
    colorBorder: 'bg-slate-800'
  }
];

export const testimonialsList: Testimonial[] = [
  {
    text: '"RoutineIQ has transformed how our clinic handles post-visit follow-ups. The AI\'s ability to translate complex dermatologist prescriptions into practical, conflict-free daily routines is unmatched in the digital health space."',
    author: 'Dr. Elena Vos',
    role: 'Chief Medical Officer, DermaCore NY',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgxJxVrZ34fKFRUn14sdzrMcMMYuVitZ6JAaTWVZ8yNBvVJu1rwtFWyeFo9XVWbqPhtgQNPcv0kOGgDxteB9GaGKxhGFs2r5t-waS0L6EXva8Wz1-pqpLpzkTh5rsk8JyrdLw8yJB3AlxO-zDi3vMZNohXm_IUPo1tu31ICFpJ1vJeTvYAq7aLNbKq0-ySNYpBhvH3M1DxYUgQjGJl2fjvlOsNxTuNHyiYvTiPdA_sA8uHECPDFwtxFmSpOIkvuVOoKi93xUaHR6E'
  },
  {
    text: '"We\'ve reduced patient \'routine confusion\' by 85%. The cost-optimization feature alone makes it an essential tool for patients who want pharmaceutical-grade results without the prestige-brand markup."',
    author: 'Marcus Thorne',
    role: 'Head of Research, Sincera Bio-Health',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVoyZboVJzDnSdrzc43mO144adz-xa1n_i4V1SPZ8MzIaT0AI6B8NmM4Q4UXFo2tEak7iILNtFUXIzVc6w4lQ_q_9g1ELcuYZwpxgcI-4i2Q7Rk1mp5Uq3BpmCsXVaB9NwOxpe_mOkNxvCoxvyaVfnbQTlI8m0rJfG3DxyCMTQngP325cJlCoLBgUJU24FSChWE_zlWoYusY0BxywgDm6SK3nwLThwNz16yoY5XIDksXyt2H6mOETI21Jq7xv_tm7-SC8E28YKAF4'
  }
];

export const comparisonMetricsList: ComparisonMetric[] = [
  { name: 'Ingredient Synergy', before: 'Low (4 Active Conflicts)', after: 'Perfect (0 Conflicts)' },
  { name: 'Monthly Cost', before: '$345.00', after: '$89.00' },
  { name: 'Daily Steps', before: '12 Steps (Complex)', after: '5 Steps (High Density)' },
  { name: 'Barrier Health', before: 'Compromised (Redness)', after: 'Resilient (Restored)' }
];
