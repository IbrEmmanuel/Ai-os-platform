export interface Agent {
  id: string;
  name: string;
  role: string;
  model: string;
  systemPrompt: string;
  temperature: number;
  status: "idle" | "active" | "error";
  connectedAPIs: string[];
  createdAt: string;
}

export interface RAGDocument {
  id: string;
  title: string;
  content: string;
  charCount: number;
  category: string;
  createdAt: string;
}

export interface ExecLog {
  id: string;
  timestamp: string;
  agentName: string;
  action: string;
  details: string;
  latencyMs: number;
  status: "success" | "warning" | "error";
}

export interface IntegrationTrigger {
  id: string;
  name: string;
  type: string;
  status: string;
  lastTrigger: string;
}

export interface ScenarioStep {
  step: string;
  agent: string;
  output: string;
  status: string;
  latency: number;
}

export type SidebarTab =
  | "dashboard"
  | "agents"
  | "scenarios"
  | "rag"
  | "integrations"
  | "playground"
  | "academy"
  | "logs"
  | "settings";
