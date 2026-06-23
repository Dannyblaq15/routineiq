/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ScreenType =
  | 'home'
  | 'analysis'
  | 'inventory'
  | 'analytics'
  | 'landing'
  | 'intelligence'
  | 'settings'
  | 'agent-dashboard'
  | 'memory-timeline'
  | 'product-shelf'
  | 'routine-view'
  | 'agent-insights'
  | 'progress'
  | 'chat';

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

// ─── MemoryAgent Types ────────────────────────────────────────────────────────

export type EpisodeType =
  | 'report_uploaded'
  | 'report_analyzed'
  | 'routine_created'
  | 'routine_updated'
  | 'product_added'
  | 'product_removed'
  | 'reaction_logged'
  | 'preference_updated'
  | 'agent_decision'
  | 'agent_alert'
  | 'agent_learning';

export interface AgentEpisode {
  id: string;
  episodeType: EpisodeType;
  title: string;
  summary: string;
  occurredAt: string;
  relatedEntityType?: 'report' | 'product' | 'routine';
  relatedEntityId?: string;
  agentId?: string;
  isVisibleToUser: boolean;
}

export type DecisionStatus = 'pending' | 'approved' | 'rejected' | 'auto_applied';

export interface AgentDecision {
  id: string;
  decisionType: string;
  status: DecisionStatus;
  title: string;
  reasoning: string;
  confidence: number;
  createdAt: string;
  expiresAt?: string;
}

export interface AgentPreferences {
  complexity: 'minimal' | 'moderate' | 'full';
  amMaxSteps: number;
  pmMaxSteps: number;
  fragranceSensitive: boolean;
  budgetMonthlyAvg: number;
  brandAvoidance: string[];
  confidenceScore: number;
}

export interface RoutineStep {
  id: string;
  stepNumber: number;
  period: 'morning' | 'evening';
  productName: string;
  brand: string;
  instructions: string;
  whyIncluded: string;
  keyIngredient: string;
  waitAfterMins: number;
  isOptional: boolean;
  isCompleted?: boolean;
}

export interface RoutineScore {
  overall: number;
  compatibility: number;
  effectiveness: number;
  costEfficiency: number;
  compliance: number;
  simplicity: number;
}

export interface AgentProduct {
  id: string;
  brandName: string;
  productName: string;
  productType: string;
  score: number;
  agentBadge: 'keep' | 'replace' | 'conflict' | 'duplicate';
  agentBadgeDetail: string;
  keyIngredients: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  createdAt: string;
  citations?: string[];
}
