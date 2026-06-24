import React from "react";
import { Terminal, Trash2, RefreshCw } from "lucide-react";
import { ExecLog } from "../types";

interface LogsProps {
  logs: ExecLog[];
  onClear: () => void;
  onRefresh: () => void;
}

export default function TerminalLogs({ logs, onClear, onRefresh }: LogsProps) {
  return (
    <div className="cyber-panel rounded-xl p-5 bg-[#0f1e36]/80 border border-[#1e3b63] h-full flex flex-col justify-between">
      {/* Title */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyber-cyan animate-pulse" />
            <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider">
              Recent Logs / Prompt Executions
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-refresh-logs"
              onClick={onRefresh}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
              title="Refresh logs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              id="btn-clear-logs"
              onClick={onClear}
              className="text-slate-400 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
              title="Clear terminal buffer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Logs terminal box */}
        <div className="bg-[#070d19]/90 border border-[#1e3b63]/60 rounded-lg p-3 font-mono text-[10px] space-y-2.5 max-h-56 overflow-y-auto leading-relaxed">
          {logs.length > 0 ? (
            logs.map((log) => {
              const isSuccess = log.status === "success";
              const isWarning = log.status === "warning";
              const isError = log.status === "error";

              return (
                <div key={log.id} className="border-b border-[#1e3b63]/25 pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-slate-500 mb-0.5">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSuccess
                            ? "bg-emerald-400"
                            : isWarning
                            ? "bg-amber-400 animate-pulse"
                            : "bg-rose-500"
                        }`}
                      />
                      <span className="text-slate-300 font-semibold">{log.agentName}</span>
                    </span>
                    <span>{log.timestamp}</span>
                  </div>
                  <div className="text-cyber-cyan font-semibold flex items-center justify-between">
                    <span>&gt; {log.action}</span>
                    <span className="text-slate-500 text-[9px]">{log.latencyMs}ms</span>
                  </div>
                  <p className="text-slate-400 mt-1 pl-3 font-sans break-all">
                    {log.details}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="text-slate-500 text-center py-6">
              &gt; SYSTEM BUFFER EMPTY. NO LOGS EMITTED YET.
            </div>
          )}
        </div>
      </div>

      {/* Terminal Footer status info */}
      <div className="mt-3 text-[9px] font-mono text-slate-500 flex justify-between items-center bg-[#070d19]/40 p-2 rounded">
        <span>LOGS CACHED: {logs.length} / 50</span>
        <span className="text-cyber-cyan animate-pulse">SYSTEM LIVE SECURED</span>
      </div>
    </div>
  );
}
