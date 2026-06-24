import React, { useState } from "react";
import { Award, CheckCircle, Copy, HelpCircle, Code, BookOpen } from "lucide-react";

interface AcademyProps {
  onLoadTemplate: (prompt: string, systemPrompt: string) => void;
}

export default function Academy({ onLoadTemplate }: AcademyProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const guides = [
    {
      id: "lesson-1",
      title: "System Instructions Architecture",
      category: "Lesson 01",
      description: "Instruct model constraints, behavioral limits, and enforce JSON output interfaces securely.",
      systemPrompt: "You are a lead dispatcher. Return strictly JSON of type { routeTo: string, priority: 'HIGH' | 'LOW' }.",
      prompt: "Can you dispatch this email support request? 'My billing has an error!'"
    },
    {
      id: "lesson-2",
      title: "Self-Correction Loops Pattern",
      category: "Lesson 02",
      description: "Equip your agent to review its own draft output and refine it prior to action emission.",
      systemPrompt: "Write a short answer to the user query. Then, review it for clarity and correctness. Rewrite if needed.",
      prompt: "Explain Nginx reverse gateway timeout on port 3000."
    },
    {
      id: "lesson-3",
      title: "High-Performance RAG Formatting",
      category: "Lesson 03",
      description: "Format documents within XML boundaries to let Gemini fetch and extract accurate citations.",
      systemPrompt: "Answer only using facts enclosed within <knowledge> tags. Cite document titles strictly.",
      prompt: "What is the SLA response guarantee for the enterprise pricing plan?"
    },
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="cyber-panel rounded-xl p-5 bg-[#0f1e36]/80 border border-[#1e3b63] h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-cyber-cyan animate-pulse" />
            <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider">
              Learn AI Academy: Scratch To Hero
            </h3>
          </div>
          <span className="text-[9px] font-mono text-[#00f0ff] bg-cyber-cyan/15 px-2 py-0.5 rounded border border-cyber-cyan/30">
            PROMPT SYLLABUS
          </span>
        </div>

        {/* Content list */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {guides.map((g) => (
            <div
              key={g.id}
              className="p-3 rounded-lg bg-[#070d19]/60 border border-[#1e3b63]/40 flex flex-col justify-between hover:border-cyber-cyan/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-mono text-cyber-cyan bg-cyber-cyan/10 px-1.5 py-0.5 rounded border border-cyber-cyan/20">
                    {g.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      id={`btn-copy-academy-${g.id}`}
                      onClick={() => handleCopy(g.id, g.systemPrompt)}
                      className="text-slate-500 hover:text-white transition-colors"
                      title="Copy System Prompt"
                    >
                      {copiedId === g.id ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      id={`btn-load-academy-${g.id}`}
                      onClick={() => onLoadTemplate(g.prompt, g.systemPrompt)}
                      className="text-cyber-cyan hover:text-white text-[9px] font-mono uppercase bg-cyber-cyan/10 hover:bg-cyber-cyan/20 px-2 py-0.5 rounded border border-cyber-cyan/20 transition-all cursor-pointer"
                      title="Load into Prompt Playground"
                    >
                      Load Demo
                    </button>
                  </div>
                </div>

                <h4 className="text-xs font-semibold text-white tracking-wide">
                  {g.title}
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  {g.description}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#1e3b63]/30 flex items-center justify-between text-[8px] font-mono text-slate-500">
                <span className="truncate max-w-[170px]">INSTRUCTION: {g.systemPrompt.substring(0, 30)}...</span>
                <span>STATUS: SECURED</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Footer bar */}
      <div className="mt-4 p-2.5 bg-[#070d19]/50 rounded-lg flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-cyber-cyan" />
          SYLLABUS PROGRESS
        </span>
        <span className="text-cyber-cyan font-bold">100% DISCOVERED</span>
      </div>
    </div>
  );
}
