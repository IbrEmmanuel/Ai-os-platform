import React from "react";
import {
  LayoutDashboard,
  Cpu,
  GitBranch,
  Database,
  Terminal,
  Network,
  Activity,
  Award,
  Settings,
  HelpCircle,
  Radio,
  FileText
} from "lucide-react";
import { SidebarTab } from "../types";

interface SidebarProps {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "agents", label: "AI Agents", icon: Cpu },
    { id: "scenarios", label: "Workflow Scenarios", icon: GitBranch },
    { id: "rag", label: "RAG Engine", icon: Database },
    { id: "integrations", label: "Agent Radar / APIs", icon: Radio },
    { id: "playground", label: "Prompt Playground", icon: Terminal },
    { id: "academy", label: "Learn AI Academy", icon: Award },
    { id: "logs", label: "System Exec Logs", icon: FileText },
  ];

  return (
    <aside id="sidebar-panel" className="w-68 bg-[#070d19]/90 border-r border-[#1e3b63] h-screen flex flex-col shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#1e3b63]/60 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyber-blue to-cyber-cyan flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
          <Network className="w-5 h-5 text-[#070d19]" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg text-white tracking-wider uppercase glow-cyan flex items-center gap-1.5">
            FutureOS
          </h1>
          <p className="text-[10px] text-cyber-cyan/70 font-mono tracking-widest">
            STACK AI PLATFORM
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase px-3 mb-2">
          Core Workspaces
        </div>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              id={`nav-btn-${item.id}`}
              key={item.id}
              onClick={() => setActiveTab(item.id as SidebarTab)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 group relative font-medium ${
                isActive
                  ? "bg-cyber-cyan/10 text-cyber-cyan border-l-2 border-cyber-cyan font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <IconComponent
                className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                  isActive ? "text-cyber-cyan" : "text-slate-400 group-hover:scale-110"
                }`}
              />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_8px_#00f0ff]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-[#1e3b63]/60 bg-[#0a1424]/40">
        <button
          id="btn-settings"
          onClick={() => setActiveTab("settings")}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-mono transition-all duration-200 ${
            activeTab === "settings"
              ? "bg-cyber-cyan/10 text-cyber-cyan"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
          }`}
        >
          <Settings className="w-4 h-4 animate-spin-slow text-slate-400" />
          <span>SYSTEM SETTINGS</span>
        </button>
        <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-500 px-3">
          <span>PORT: 3000</span>
          <span className="text-cyber-cyan animate-pulse">● SECURE</span>
        </div>
      </div>
    </aside>
  );
}
