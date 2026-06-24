import React, { useState, useEffect } from "react";
import { Terminal, Send, Cpu, Sliders, Play, RefreshCw, HelpCircle, CheckCircle } from "lucide-react";
import { Agent } from "../types";

interface PlaygroundProps {
  initialPrompt?: string;
  initialSystemPrompt?: string;
}

export default function PromptPlayground({ initialPrompt = "", initialSystemPrompt = "" }: PlaygroundProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [systemPrompt, setSystemPrompt] = useState<string>(
    initialSystemPrompt || "You are an AI Agent with high analytical reasoning capabilities."
  );
  const [prompt, setPrompt] = useState<string>(
    initialPrompt || "Explain how agent nodes self-coordinate to resolve multi-step ticket pipelines."
  );
  const [temperature, setTemperature] = useState<number>(0.7);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [output, setOutput] = useState<string>("");
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  // Synchronize load demo changes from Academy
  useEffect(() => {
    if (initialPrompt) setPrompt(initialPrompt);
    if (initialSystemPrompt) setSystemPrompt(initialSystemPrompt);
  }, [initialPrompt, initialSystemPrompt]);

  const fetchAgents = async () => {
    try {
      const response = await fetch("/api/agents");
      const data = await response.json();
      setAgents(data);
      if (data.length > 0) {
        setSelectedAgentId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectAgent = (agentId: string) => {
    setSelectedAgentId(agentId);
    const agent = agents.find((a) => a.id === agentId);
    if (agent) {
      setSystemPrompt(agent.systemPrompt);
      setTemperature(agent.temperature);
    }
  };

  const handleRunPlayground = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setOutput("");
    setLatency(null);

    try {
      const response = await fetch("/api/prompt/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          systemPrompt,
          temperature,
          agentId: selectedAgentId,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Execution failed");

      setOutput(data.response);
      setLatency(data.latencyMs);
    } catch (err: any) {
      console.error(err);
      setOutput(`ERROR: ${err.message || "Cognitive engine computation aborted."}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cyber-panel rounded-xl p-5 bg-[#0f1e36]/80 border border-[#1e3b63] h-full flex flex-col justify-between">
      <div>
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyber-cyan" />
            <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider">
              Prompt & Agent Playground
            </h3>
          </div>
          <span className="text-[10px] font-mono text-cyber-cyan bg-cyber-cyan/15 px-2 py-0.5 rounded border border-cyber-cyan/30">
            COMPILER MODE ACTIVE
          </span>
        </div>

        {/* Form controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          {/* Select Agent template */}
          <div className="md:col-span-4 space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase">Load Agent Settings</label>
            <select
              id="playground-agent-select"
              value={selectedAgentId}
              onChange={(e) => handleSelectAgent(e.target.value)}
              className="w-full bg-[#070d19]/80 border border-[#1e3b63] rounded p-2 text-xs text-white focus:outline-none focus:border-cyber-cyan cursor-pointer"
            >
              <option value="">-- No Agent Template --</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sliders */}
          <div className="md:col-span-4 space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase block">Temperature: {temperature}</label>
            <input
              id="playground-temp-slider"
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-cyber-cyan mt-1.5"
            />
          </div>

          {/* Model Status info */}
          <div className="md:col-span-4 space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase block">Cognitive Model</label>
            <div className="text-xs text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/25 rounded p-2 text-center font-mono font-semibold">
              gemini-3.5-flash
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* System Instructions */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase block">System Instructions</label>
            <textarea
              id="playground-sysprompt-textarea"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={4}
              className="w-full bg-[#070d19]/80 border border-[#1e3b63] rounded p-2 text-xs text-white font-mono focus:outline-none focus:border-cyber-cyan resize-none"
              placeholder="Inject core agent instructions..."
            />
          </div>

          {/* User message */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase block">User Message Prompt</label>
            <textarea
              id="playground-userprompt-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="w-full bg-[#070d19]/80 border border-[#1e3b63] rounded p-2 text-xs text-white font-mono focus:outline-none focus:border-cyber-cyan resize-none"
              placeholder="What do you want to ask the agent?"
            />
          </div>
        </div>
      </div>

      {/* Output results */}
      <div>
        {output && (
          <div className="p-3 bg-[#070d19]/90 border border-cyber-cyan/30 rounded-lg mb-4">
            <div className="flex items-center justify-between text-[10px] font-mono text-cyber-cyan border-b border-[#1e3b63]/30 pb-1.5 mb-2">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-cyber-cyan" />
                COGNITIVE COMPLETION RECEIVED
              </span>
              <span>LATENCY: {latency}ms</span>
            </div>
            <p className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {output}
            </p>
          </div>
        )}

        <button
          id="btn-run-playground"
          onClick={handleRunPlayground}
          disabled={isLoading || !prompt}
          className={`w-full py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 font-display text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
            isLoading
              ? "bg-[#1e3b63] text-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-cyber-blue to-cyber-cyan text-white hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Generating Gemini cognitive completions...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 shrink-0" />
              <span>Run completion query</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
