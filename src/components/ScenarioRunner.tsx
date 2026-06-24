import React, { useState } from "react";
import { GitBranch, Play, RefreshCw, Loader, AlertCircle, CheckCircle, Database, HelpCircle } from "lucide-react";
import { ScenarioStep } from "../types";

interface ScenarioRunnerProps {
  onRunComplete: () => void;
}

export default function ScenarioRunner({ onRunComplete }: ScenarioRunnerProps) {
  const [ticketPayload, setTicketPayload] = useState<string>(
    "Hi support, our enterprise node cluster is throwing Nginx reverse gateway timeouts on Port 3000. We pay for the $4,999/mo premium tier, is our 15-minute SLA covered?"
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [steps, setSteps] = useState<ScenarioStep[]>([]);
  const [totalLatency, setTotalLatency] = useState<number>(0);

  const triggerScenario = async () => {
    setIsRunning(true);
    setCurrentStep(1);
    setSteps([]);

    try {
      // Step 1: Simulate cognitive startup delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCurrentStep(2);

      const response = await fetch("/api/scenario/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioType: "support_escalation",
          inputPayload: ticketPayload,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Scenario failed");

      // Step 2: Show progression timing
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCurrentStep(3);
      await new Promise((resolve) => setTimeout(resolve, 600));

      setSteps(data.steps);
      setTotalLatency(data.totalLatencyMs);
      onRunComplete(); // Trigger reload of terminal logs in main dashboard
    } catch (err: any) {
      console.error(err);
      setSteps([
        {
          step: "Orchestration Fault",
          agent: "System Gateway",
          output: err.message || "Cognitive pipeline aborted due to server error.",
          status: "error",
          latency: 0,
        },
      ]);
    } finally {
      setIsRunning(false);
      setCurrentStep(0);
    }
  };

  return (
    <div className="cyber-panel rounded-xl p-5 bg-[#0f1e36]/80 border border-[#1e3b63] h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyber-cyan" />
            <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider">
              Workflow Scenario: Ticket Escalation RAG
            </h3>
          </div>
          <span className="text-[9px] font-mono text-[#00f0ff] bg-cyber-cyan/10 px-2 py-0.5 rounded border border-cyber-cyan/20">
            AUTO-SCALE SEQUENCE
          </span>
        </div>

        {/* Info description */}
        <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
          Orchestrate multiple specialized agents to analyze tickets, retrieve contextual documentation using semantic search, format a resolution, and dispatch it.
        </p>

        {/* Input area */}
        <div className="space-y-2 mb-4">
          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
            Customer Ticket Payload
          </label>
          <textarea
            id="ticket-payload-input"
            value={ticketPayload}
            onChange={(e) => setTicketPayload(e.target.value)}
            disabled={isRunning}
            className="w-full h-18 bg-[#070d19]/80 border border-[#1e3b63] rounded-lg p-2.5 text-xs text-white font-sans focus:outline-none focus:border-cyber-cyan transition-colors resize-none focus:ring-1 focus:ring-cyber-cyan/30"
            placeholder="Type ticket payload to test workflow..."
          />
        </div>

        {/* Execution visualization steps */}
        <div className="space-y-3 mb-4">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            Pipeline Execution Flow
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Step 1 */}
            <div
              className={`p-2.5 rounded-lg border text-center transition-all ${
                currentStep === 1
                  ? "bg-cyber-cyan/15 border-cyber-cyan shadow-[0_0_8px_rgba(0,240,255,0.2)]"
                  : steps.length > 0
                  ? "bg-[#070d19]/40 border-emerald-500/30 text-emerald-400"
                  : "bg-[#070d19]/70 border-[#1e3b63]/50 text-slate-500"
              }`}
            >
              <div className="text-[8px] font-mono uppercase tracking-widest">
                Step 01
              </div>
              <div className="text-[10px] font-semibold mt-1 truncate">Lead Router</div>
              <div className="text-[8px] font-mono mt-0.5 opacity-80">Classify Ticket</div>
            </div>

            {/* Step 2 */}
            <div
              className={`p-2.5 rounded-lg border text-center transition-all ${
                currentStep === 2
                  ? "bg-cyber-cyan/15 border-cyber-cyan shadow-[0_0_8px_rgba(0,240,255,0.2)]"
                  : steps.length > 0
                  ? "bg-[#070d19]/40 border-emerald-500/30 text-emerald-400"
                  : "bg-[#070d19]/70 border-[#1e3b63]/50 text-slate-500"
              }`}
            >
              <div className="text-[8px] font-mono uppercase tracking-widest">
                Step 02
              </div>
              <div className="text-[10px] font-semibold mt-1 truncate">RAG Resolver</div>
              <div className="text-[8px] font-mono mt-0.5 opacity-80">Context Search</div>
            </div>

            {/* Step 3 */}
            <div
              className={`p-2.5 rounded-lg border text-center transition-all ${
                currentStep === 3
                  ? "bg-cyber-cyan/15 border-cyber-cyan shadow-[0_0_8px_rgba(0,240,255,0.2)]"
                  : steps.length > 0
                  ? "bg-[#070d19]/40 border-emerald-500/30 text-emerald-400"
                  : "bg-[#070d19]/70 border-[#1e3b63]/50 text-slate-500"
              }`}
            >
              <div className="text-[8px] font-mono uppercase tracking-widest">
                Step 03
              </div>
              <div className="text-[10px] font-semibold mt-1 truncate">Slack Hub</div>
              <div className="text-[8px] font-mono mt-0.5 opacity-80">Dispatch Action</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action / Results panel */}
      <div>
        {steps.length > 0 && !isRunning && (
          <div className="p-3 bg-[#070d19]/80 border border-emerald-500/30 rounded-lg mb-4 space-y-2 max-h-36 overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle className="w-3 h-3" /> PIPELINE SECURED RUN COMPLETE
              </span>
              <span className="text-[9px] font-mono text-slate-400">
                LATENCY: {totalLatency}ms
              </span>
            </div>
            {steps.map((st, idx) => (
              <div key={idx} className="text-[10px] border-l border-[#1e3b63] pl-2 py-0.5 space-y-1">
                <div className="font-mono text-cyber-cyan flex items-center justify-between">
                  <span>{st.step} ({st.agent})</span>
                  <span className="text-slate-500 text-[8px]">{st.latency}ms</span>
                </div>
                <p className="text-slate-300 font-sans leading-relaxed text-[9px]">
                  {st.output}
                </p>
              </div>
            ))}
          </div>
        )}

        <button
          id="btn-run-scenario"
          onClick={triggerScenario}
          disabled={isRunning || !ticketPayload}
          className={`w-full py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 font-display text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
            isRunning
              ? "bg-[#1e3b63] text-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-cyber-blue to-cyber-cyan text-white hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
          }`}
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Orchestrating Cognitive Agent Nodes...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 shrink-0" />
              <span>Trigger Multi-Agent Scenario Run</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
