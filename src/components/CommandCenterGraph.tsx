import React, { useState } from "react";
import { Cpu, HelpCircle, Activity, Shield, Zap } from "lucide-react";
import { Agent } from "../types";

interface CommandCenterProps {
  agents: Agent[];
}

export default function CommandCenterGraph({ agents }: CommandCenterProps) {
  const [selectedNode, setSelectedNode] = useState<string>("lead-router");

  // Nodes for visualization
  const graphNodes = [
    { id: "lead-router", label: "Lead Router", x: 140, y: 110, role: "Inbound Router", color: "#00f0ff" },
    { id: "rag-resolver", label: "RAG Resolver", x: 280, y: 60, role: "Vector Lookup", color: "#3b82f6" },
    { id: "voice-caller", label: "Voice Caller", x: 280, y: 160, role: "Outbound Call AI", color: "#ec4899" },
    { id: "slack-api", label: "Slack Webhook", x: 420, y: 60, role: "Trigger Target", color: "#10b981" },
    { id: "vector-engine", label: "Vector DB Engine", x: 420, y: 160, role: "Embedding Sync", color: "#f59e0b" },
  ];

  const connections = [
    { from: "lead-router", to: "rag-resolver" },
    { from: "lead-router", to: "voice-caller" },
    { from: "rag-resolver", to: "slack-api" },
    { from: "voice-caller", to: "vector-engine" },
    { from: "rag-resolver", to: "vector-engine" },
  ];

  const activeAgent = agents.find((a) => a.id === selectedNode) || {
    name: selectedNode === "slack-api" ? "Slack Webhook Connection" : "Vector Database Engine",
    role: selectedNode === "slack-api" ? "Outbound Notification Channel" : "Fast Semantic Vector Storage",
    model: "Internal Protocol Gateway",
    temperature: 0.0,
    status: "active",
    connectedAPIs: selectedNode === "slack-api" ? ["Lead Router", "RAG Resolver"] : ["RAG Resolver", "Voice Agent"],
    systemPrompt: "No prompt. Triggered via HTTP JSON POST. Dispatches real-time alerts to Slack workspaces.",
  };

  return (
    <div className="cyber-panel cyber-panel-active rounded-xl p-5 relative overflow-hidden bg-gradient-to-b from-[#0f1e36]/90 to-[#070d19]/90 border border-[#1e3b63] h-full flex flex-col justify-between">
      {/* Panel Title */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyber-cyan animate-pulse" />
          <h3 className="font-display font-semibold text-sm text-white tracking-wide uppercase">
            AI Command Center
          </h3>
        </div>
        <span className="text-[10px] font-mono text-cyber-cyan bg-cyber-cyan/10 px-2 py-0.5 rounded border border-cyber-cyan/30">
          SECURE PROTOCOL ACTIVE
        </span>
      </div>

      {/* Main SVG and Node Grid Interactive Canvas */}
      <div className="relative w-full h-44 bg-[#070d19]/60 border border-[#1e3b63]/40 rounded-lg cyber-grid flex items-center justify-center overflow-hidden">
        {/* Connection Lines (glowing backdrops) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map((conn, idx) => {
            const fromNode = graphNodes.find((n) => n.id === conn.from);
            const toNode = graphNodes.find((n) => n.id === conn.to);
            if (!fromNode || !toNode) return null;
            return (
              <g key={idx}>
                {/* Glowing glow-backline */}
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={fromNode.color}
                  strokeWidth="2"
                  strokeOpacity="0.15"
                  className="animate-pulse"
                />
                {/* Direct line */}
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={fromNode.color}
                  strokeWidth="1"
                  strokeOpacity="0.4"
                  strokeDasharray="4 4"
                />
              </g>
            );
          })}
        </svg>

        {/* Nodes Placement */}
        {graphNodes.map((node) => {
          const isSelected = selectedNode === node.id;
          return (
            <button
              key={node.id}
              id={`node-${node.id}`}
              onClick={() => setSelectedNode(node.id)}
              style={{ left: `${node.x - 45}px`, top: `${node.y - 25}px` }}
              className={`absolute w-24 h-12 rounded-lg border flex flex-col justify-center items-center cursor-pointer transition-all duration-300 z-10 ${
                isSelected
                  ? "bg-[#0f1e36]/90 border-cyber-cyan shadow-[0_0_12px_rgba(0,240,255,0.4)] scale-105"
                  : "bg-[#070d19]/80 border-[#1e3b63] hover:border-slate-400"
              }`}
            >
              <span
                className="text-[9px] font-mono font-bold truncate max-w-[85px]"
                style={{ color: node.color }}
              >
                {node.label}
              </span>
              <span className="text-[7px] text-slate-400 font-sans truncate max-w-[85px]">
                {node.role}
              </span>
              {/* Active connection pulse dot */}
              <span
                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-black animate-pulse"
                style={{ backgroundColor: node.color }}
              />
            </button>
          );
        })}
      </div>

      {/* Selected Node Inspector Details */}
      <div className="mt-4 p-3 bg-[#0a1424]/90 rounded-lg border border-[#1e3b63]/60">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-xs font-display font-semibold text-cyber-cyan glow-cyan">
              {activeAgent.name}
            </h4>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              {activeAgent.role} • {activeAgent.model || "Local Target"}
            </p>
          </div>
          <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
            <Shield className="w-2.5 h-2.5" /> DEPLOYED
          </span>
        </div>
        <p className="text-[10px] text-slate-300 mt-2 font-sans line-clamp-2">
          {activeAgent.systemPrompt}
        </p>

        <div className="mt-2.5 pt-2 border-t border-[#1e3b63]/40 flex items-center justify-between text-[8px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyber-cyan" />
            TEMP: {activeAgent.temperature ?? 0.1}
          </span>
          <span className="truncate max-w-[180px]">
            BOUND APIS: {activeAgent.connectedAPIs?.join(", ") || "None"}
          </span>
        </div>
      </div>
    </div>
  );
}
