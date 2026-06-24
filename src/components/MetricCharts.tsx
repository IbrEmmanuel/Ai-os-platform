import React from "react";
import { Activity, Zap, Cpu } from "lucide-react";

export default function MetricCharts() {
  return (
    <div className="cyber-panel rounded-xl p-5 bg-[#0f1e36]/80 border border-[#1e3b63] h-full flex flex-col justify-between">
      {/* Title */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyber-cyan" />
            <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider">
              Node Knowledge / Data Throughput
            </h3>
          </div>
          <span className="text-[9px] font-mono text-[#00f0ff] bg-cyber-cyan/15 px-2 py-0.5 rounded border border-cyber-cyan/30">
            METRIC TRACKING LIVE
          </span>
        </div>

        {/* Custom Glowing SVG Chart */}
        <div className="relative w-full h-32 bg-[#070d19]/60 border border-[#1e3b63]/40 rounded-lg cyber-grid flex items-end p-2 overflow-hidden">
          {/* Neon Grid Backlines */}
          <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20" />

          {/* SVG line and area fill graph */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Glowing filled area path */}
            <path
              d="M 0 100 Q 60 70, 120 40 T 240 85 T 360 30 T 480 60 T 600 20 L 600 120 L 0 120 Z"
              fill="url(#chart-glow)"
            />

            {/* Glowing stroke path line */}
            <path
              d="M 0 100 Q 60 70, 120 40 T 240 85 T 360 30 T 480 60 T 600 20"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="2"
              className="glow-cyan"
            />
          </svg>

          {/* Dynamic hover labels inside the chart */}
          <div className="absolute top-2 left-3 bg-[#0a1424]/90 border border-cyber-cyan/30 px-2 py-0.5 rounded text-[8px] font-mono text-cyber-cyan">
            THROUGHPUT: 1.48M TOKENS/S
          </div>

          <div className="absolute top-2 right-3 bg-[#0a1424]/90 border border-[#1e3b63] px-2 py-0.5 rounded text-[8px] font-mono text-slate-400">
            API LATENCY: 224MS
          </div>
        </div>
      </div>

      {/* Grid stats overview details */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="p-2.5 rounded-lg bg-[#070d19]/60 border border-[#1e3b63]/40 text-center">
          <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
            Prompt Cache Hit
          </div>
          <div className="text-xs font-bold text-white mt-1">94.8%</div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#070d19]/60 border border-[#1e3b63]/40 text-center">
          <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
            Accuracy Rating
          </div>
          <div className="text-xs font-bold text-[#00f0ff] mt-1 glow-cyan">99.12%</div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#070d19]/60 border border-[#1e3b63]/40 text-center">
          <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
            Active Threads
          </div>
          <div className="text-xs font-bold text-white mt-1">12 / 12</div>
        </div>
      </div>
    </div>
  );
}
