/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ScreenType = 'home' | 'analysis' | 'inventory' | 'analytics' | 'landing' | 'intelligence' | 'settings';

export interface PatientAnalysis {
  id: string;
  type: string;
  clinician: string;
  status: 'COMPLETE' | 'PENDING';
  severity?: 'High' | 'Medium' | 'Low';
  date: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  phase: string;
  category: string;
  compatibility: number;
  tags: string[];
  statusText: string;
  imageUrl: string;
  statusType: 'error' | 'warning' | 'normal' | 'success';
}

export interface RecommendedIngredient {
  name: string;
  role: 'Primary' | 'Restorative' | 'Secondary';
  description: string;
  iconName: 'science' | 'water_drop' | 'spa';
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular: boolean;
  colorBorder: string;
}

export interface Testimonial {
  text: string;
  author: string;
  role: string;
  imageUrl: string;
}

export interface ComparisonMetric {
  name: string;
  before: string;
  after: string;
}

export interface SettingItem {
  email: boolean;
  push: boolean;
  sms: boolean;
  routineCompliance: boolean;
  inventoryAlerts: boolean;
  clinicalIntelligence: boolean;
  systemAlerts: boolean;
}
