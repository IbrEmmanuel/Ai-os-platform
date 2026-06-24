import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Volume2,
  RefreshCw,
  Cpu,
  GitBranch,
  Database,
  Radio,
  Terminal as TerminalIcon,
  Award,
  Settings as SettingsIcon,
  User,
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import { SidebarTab, Agent, ExecLog } from "./types";
import Sidebar from "./components/Sidebar";
import CommandCenterGraph from "./components/CommandCenterGraph";
import ScenarioRunner from "./components/ScenarioRunner";
import VoiceAgent from "./components/VoiceAgent";
import RAGEngine from "./components/RAGEngine";
import AgentCreator from "./components/AgentCreator";
import ApiHub from "./components/ApiHub";
import Academy from "./components/Academy";
import TerminalLogs from "./components/TerminalLogs";
import SettingsPanel from "./components/SettingsPanel";
import MetricCharts from "./components/MetricCharts";
import PromptPlayground from "./components/PromptPlayground";

export default function App() {
  const [activeTab, setActiveTab] = useState<SidebarTab>("dashboard");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [logs, setLogs] = useState<ExecLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchVal, setSearchVal] = useState<string>("");

  // Academy load template connection
  const [playgroundPrompt, setPlaygroundPrompt] = useState<string>("");
  const [playgroundSysPrompt, setPlaygroundSysPrompt] = useState<string>("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [agentRes, logRes] = await Promise.all([
        fetch("/api/agents"),
        fetch("/api/logs")
      ]);
      const agentData = await agentRes.json();
      const logData = await logRes.json();
      setAgents(agentData);
      setLogs(logData);
    } catch (err) {
      console.error("Failed to load initial data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearLogs = async () => {
    try {
      const response = await fetch("/api/logs/clear", { method: "POST" });
      if (response.ok) {
        fetchInitialData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoadDemoTemplate = (prompt: string, sysPrompt: string) => {
    setPlaygroundPrompt(prompt);
    setPlaygroundSysPrompt(sysPrompt);
    setActiveTab("playground");
  };

  return (
    <div className="flex h-screen bg-[#070d19] text-slate-100 overflow-hidden font-sans">
      {/* 1. Left Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Main Console Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Control Bar Header */}
        <header id="top-bar" className="h-16 border-b border-[#1e3b63]/60 bg-[#070d19]/80 flex items-center justify-between px-6 shrink-0 z-20">
          {/* Left search */}
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              id="top-search-input"
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-[#0a1424]/90 border border-[#1e3b63]/60 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-cyber-cyan transition-colors"
              placeholder="Search AI resources, nodes, APIs..."
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-5">
            {/* Status indicators */}
            <div className="flex items-center gap-3 bg-[#0a1424] px-3 py-1 rounded border border-[#1e3b63]/30 text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
                API ACTIVE
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-cyber-cyan">99.1% COMPREHENSION</span>
            </div>

            {/* Audio Signal visualization */}
            <button
              id="btn-volume-status"
              className="p-1.5 text-slate-400 hover:text-cyber-cyan hover:bg-[#0f1e36]/50 rounded-lg transition-all"
              title="Voice feedback monitoring active"
            >
              <Volume2 className="w-4 h-4 animate-pulse text-cyber-cyan" />
            </button>

            {/* Notifications */}
            <button
              id="btn-notifications"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-[#0f1e36]/50 rounded-lg transition-all relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-cyber-pink" />
            </button>

            {/* User Account / Email representation */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-[#1e3b63]/40">
              <div className="w-7 h-7 rounded-full bg-[#1e3b63] flex items-center justify-center text-xs font-mono font-bold text-cyber-cyan border border-cyber-cyan/40">
                U
              </div>
              <div className="hidden md:block">
                <div className="text-[11px] font-semibold text-white truncate max-w-[140px]">
                  habu23585@gmail.com
                </div>
                <div className="text-[8px] font-mono text-slate-500 uppercase">
                  Operator Role
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Console view layout container */}
        <main className="flex-1 p-6 overflow-y-auto bg-[#070d19]/35 relative">
          {/* Subtle grid backdrop */}
          <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* FutureOS Header and system stats bar */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider glow-cyan flex items-center gap-2">
                    FutureOS Workspace
                  </h2>
                  <p className="text-xs text-slate-400">
                    Construct, optimize, and orchestrate serverless cognitive LLM agents.
                  </p>
                </div>

                <div className="flex gap-2.5">
                  <button
                    id="btn-refresh-dashboard"
                    onClick={fetchInitialData}
                    disabled={isLoading}
                    className="p-2 bg-[#0f1e36] hover:bg-slate-800 border border-[#1e3b63] rounded-lg text-slate-300 hover:text-white transition-all text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                    <span>SYNC SYSTEM</span>
                  </button>
                  <a
                    href="https://ai.studio/build"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-[#0f1e36] hover:bg-slate-800 border border-[#1e3b63] rounded-lg text-cyber-cyan hover:text-white transition-all text-xs font-mono flex items-center gap-1.5"
                  >
                    <span>EXPORT CONSOLE</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Grid 3 Columns Dashboard Layout matching image */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Column 1: AI Command Center & Connected API Hub */}
                <div className="space-y-6">
                  <div className="h-96">
                    <CommandCenterGraph agents={agents} />
                  </div>
                  <div className="h-96">
                    <ApiHub onChanged={fetchInitialData} />
                  </div>
                </div>

                {/* Column 2: Scenario Workflow & Terminal Logs */}
                <div className="space-y-6">
                  <div className="h-96">
                    <ScenarioRunner onRunComplete={fetchInitialData} />
                  </div>
                  <div className="h-96">
                    <TerminalLogs
                      logs={logs}
                      onClear={handleClearLogs}
                      onRefresh={fetchInitialData}
                    />
                  </div>
                </div>

                {/* Column 3: Voice Call Center AI & Data Throughput Charts */}
                <div className="space-y-6">
                  <div className="h-96">
                    <VoiceAgent />
                  </div>
                  <div className="h-96">
                    <MetricCharts />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-panels Full Expanded Views (When clicking sidebar tabs) */}
          {activeTab === "agents" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-display font-semibold text-white tracking-wide uppercase">
                  AI Agent Configuration Registry
                </h2>
                <p className="text-xs text-slate-400">
                  Deploy specialized nodes into the neural graph cluster.
                </p>
              </div>
              <AgentCreator onAgentChanged={fetchInitialData} />
            </div>
          )}

          {activeTab === "scenarios" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h2 className="text-lg font-display font-semibold text-white tracking-wide uppercase">
                  Workflow Orchestration Builder
                </h2>
                <p className="text-xs text-slate-400">
                  Compose sequential pipelines involving multi-model loops.
                </p>
              </div>
              <div className="h-[480px]">
                <ScenarioRunner onRunComplete={fetchInitialData} />
              </div>
            </div>
          )}

          {activeTab === "rag" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-display font-semibold text-white tracking-wide uppercase">
                  RAG Knowledge Store & Chunking Indexer
                </h2>
                <p className="text-xs text-slate-400">
                  Upload, inspect, and execute semantic vector lookup queries.
                </p>
              </div>
              <RAGEngine />
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h2 className="text-lg font-display font-semibold text-white tracking-wide uppercase">
                  Connected Integrations & Active API Radar
                </h2>
                <p className="text-xs text-slate-400">
                  Securely authorize webhook connections and third party ingress/egress.
                </p>
              </div>
              <div className="h-[480px]">
                <ApiHub onChanged={fetchInitialData} />
              </div>
            </div>
          )}

          {activeTab === "playground" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h2 className="text-lg font-display font-semibold text-white tracking-wide uppercase">
                  Cognitive Prompt Sandbox Playground
                </h2>
                <p className="text-xs text-slate-400">
                  Test raw Gemini completions directly with custom system context rules.
                </p>
              </div>
              <div className="h-[480px]">
                <PromptPlayground
                  initialPrompt={playgroundPrompt}
                  initialSystemPrompt={playgroundSysPrompt}
                />
              </div>
            </div>
          )}

          {activeTab === "academy" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h2 className="text-lg font-display font-semibold text-white tracking-wide uppercase">
                  FutureOS Prompt Academy: Scratch To Hero
                </h2>
                <p className="text-xs text-slate-400">
                  Learn advanced prompt engineering structures and template configurations.
                </p>
              </div>
              <div className="h-[420px]">
                <Academy onLoadTemplate={handleLoadDemoTemplate} />
              </div>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h2 className="text-lg font-display font-semibold text-white tracking-wide uppercase">
                  Cluster Execution Console Logs
                </h2>
                <p className="text-xs text-slate-400">
                  Inspect raw system log outputs, cognitive routing parameters, and API latencies.
                </p>
              </div>
              <div className="h-[520px]">
                <TerminalLogs
                  logs={logs}
                  onClear={handleClearLogs}
                  onRefresh={fetchInitialData}
                />
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-display font-semibold text-white tracking-wide uppercase">
                  FutureOS Config Systems
                </h2>
                <p className="text-xs text-slate-400">
                  Manage environment keys, secrets injection, and server gateways.
                </p>
              </div>
              <SettingsPanel />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
