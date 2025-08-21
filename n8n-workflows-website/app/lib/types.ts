// N8N Workflow Types
export interface N8NNode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  parameters: any;
  typeVersion: number;
}

export interface N8NConnection {
  node: string;
  type: string;
  index: number;
}

export interface N8NWorkflow {
  id: string;
  meta?: {
    instanceId?: string;
    templateCredsSetupCompleted?: boolean;
  };
  name: string;
  tags: string[];
  nodes: N8NNode[];
  connections: Record<string, { main: N8NConnection[][] }>;
  settings?: any;
  staticData?: any;
}

// Database Types
export interface WorkflowSummary {
  id: number;
  filename: string;
  name: string;
  workflowId?: string;
  active: boolean;
  description?: string;
  triggerType?: string;
  complexity?: string;
  nodeCount: number;
  integrations?: string[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  fileHash?: string;
  fileSize?: number;
  analyzedAt: Date;
}

export interface WorkflowDetail extends WorkflowSummary {
  rawJson?: N8NWorkflow;
}

// Search and Filter Types
export interface SearchParams {
  q?: string;           // Search query
  trigger?: string;     // Filter by trigger type
  complexity?: string;  // Filter by complexity
  category?: string;    // Filter by category
  active_only?: boolean;
  page?: number;
  per_page?: number;
}

export interface SearchResponse {
  workflows: WorkflowSummary[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
  query: string;
  filters: Record<string, any>;
}

// Statistics Types
export interface StatsResponse {
  total: number;
  active: number;
  inactive: number;
  triggers: Record<string, number>;
  complexity: Record<string, number>;
  total_nodes: number;
  unique_integrations: number;
  last_indexed: string;
}

// UI State Types
export interface PaginationState {
  page: number;
  per_page: number;
  total: number;
  pages: number;
}

export interface SearchFilters {
  trigger?: string;
  complexity?: string;
  category?: string;
  active_only?: boolean;
}

export interface AppState {
  search: {
    query: string;
    filters: SearchFilters;
    results: WorkflowSummary[];
    loading: boolean;
    pagination: PaginationState;
  };
  ui: {
    theme: 'light' | 'dark';
    sidebarOpen: boolean;
    selectedWorkflow: string | null;
  };
  data: {
    categories: string[];
    statistics: StatsResponse;
  };
}

// Category System
export const WORKFLOW_CATEGORIES = [
  'AI Agent Development',
  'Business Process Automation',
  'Cloud Storage & File Management',
  'Communication & Messaging',
  'Creative Content & Video Automation',
  'Creative Design Automation',
  'CRM & Sales',
  'Data Processing & Analysis',
  'E-commerce & Retail',
  'Financial & Accounting',
  'Marketing & Advertising Automation',
  'Project Management',
  'Social Media Management',
  'Technical Infrastructure & DevOps',
  'Web Scraping & Data Extraction'
] as const;

export type WorkflowCategory = typeof WORKFLOW_CATEGORIES[number];

// Trigger Types
export const TRIGGER_TYPES = [
  'Manual',
  'Webhook', 
  'Scheduled',
  'Triggered'
] as const;

export type TriggerType = typeof TRIGGER_TYPES[number];

// Complexity Levels
export const COMPLEXITY_LEVELS = [
  'low',
  'medium', 
  'high'
] as const;

export type ComplexityLevel = typeof COMPLEXITY_LEVELS[number];