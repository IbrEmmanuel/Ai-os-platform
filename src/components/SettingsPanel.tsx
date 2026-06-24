import React from "react";
import { Settings, Shield, ExternalLink, HelpCircle, Server } from "lucide-react";

export default function SettingsPanel() {
  return (
    <div className="cyber-panel rounded-xl p-5 bg-[#0f1e36]/80 border border-[#1e3b63] max-w-2xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-[#1e3b63]/40 pb-3">
        <Settings className="w-5 h-5 text-cyber-cyan animate-spin-slow" />
        <div>
          <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider">
            System Settings & Secrets
          </h3>
          <p className="text-[10px] text-slate-400 font-mono">
            MANAGE DEPLOYMENTS, CONFIGURATIONS, AND API BOUNDARIES
          </p>
        </div>
      </div>

      {/* Secret check */}
      <div className="p-3.5 bg-[#070d19]/80 border border-[#1e3b63]/60 rounded-lg space-y-2.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyber-cyan" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider">
              Gemini API Secret Status
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            AUTO-INJECT ACTIVE
          </span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
          Your Gemini API key is automatically fetched from your user secrets. To view, update, or edit your key, use the **Secrets** manager panel inside the **Google AI Studio UI**. No manual entry or custom form inputs are required in this application's interface.
        </p>
      </div>

      {/* Deploy info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Network Gateways */}
        <div className="p-3.5 bg-[#070d19]/80 border border-[#1e3b63]/60 rounded-lg space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 uppercase">
            <Server className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>Network Gateway</span>
          </div>
          <div className="text-xs text-cyber-cyan font-mono bg-[#0f1e36] p-1.5 rounded border border-[#1e3b63]/40 flex justify-between">
            <span>PORT: 3000</span>
            <span>0.0.0.0</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Host binding is configured to run behind our nginx reverse-proxy layer.
          </p>
        </div>

        {/* Deploy targets */}
        <div className="p-3.5 bg-[#070d19]/80 border border-[#1e3b63]/60 rounded-lg space-y-2">
          <span className="text-xs font-mono text-slate-300 uppercase block">
            Core Target Engine
          </span>
          <div className="text-xs text-white font-mono bg-[#0f1e36] p-1.5 rounded border border-[#1e3b63]/40">
            Express / Node / Vite
          </div>
          <p className="text-[10px] text-slate-400">
            Multi-threaded full-stack container sandbox.
          </p>
        </div>
      </div>

      {/* Information checklist */}
      <div className="p-3.5 bg-[#070d19]/40 border border-slate-700/30 rounded-lg space-y-2 text-[11px] text-slate-400">
        <div className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
          FutureOS Core Architecture Checklist
        </div>
        <ul className="space-y-1.5 list-disc pl-4 font-sans">
          <li>Primary entry point routing serves all static and cognitive services perfectly.</li>
          <li>Server-side API handlers secure your Gemini key from exposure to client bundles.</li>
          <li>Voice syntheses execute dynamically on a 24,000 Hz HD PCM envelope.</li>
          <li>RAG search models formulate dynamic embeddings to query in-memory caches.</li>
        </ul>
      </div>
    </div>
  );
}
