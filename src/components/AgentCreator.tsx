import React, { useState, useEffect } from "react";
import { Cpu, Plus, Trash2, CheckCircle, Sliders, Layers, RefreshCw } from "lucide-react";
import { Agent } from "../types";

interface AgentCreatorProps {
  onAgentChanged: () => void;
}

export default function AgentCreator({ onAgentChanged }: AgentCreatorProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<string>("Cognitive Specialist");
  const [model, setModel] = useState<string>("gemini-3.5-flash");
  const [systemPrompt, setSystemPrompt] = useState<string>("");
  const [temperature, setTemperature] = useState<number>(0.7);
  const [connectedAPIs, setConnectedAPIs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const availableAPIs = ["Slack Webhook", "SendGrid Mailer", "Vector Engine", "Twilio SIP", "GitHub API", "Gmail Sync"];

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch("/api/agents");
      const data = await response.json();
      setAgents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleAPI = (apiName: string) => {
    if (connectedAPIs.includes(apiName)) {
      setConnectedAPIs(connectedAPIs.filter((a) => a !== apiName));
    } else {
      setConnectedAPIs([...connectedAPIs, apiName]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !systemPrompt) return;
    setIsLoading(true);
    setSuccess(false);

    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role,
          model,
          systemPrompt,
          temperature,
          connectedAPIs,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setName("");
        setSystemPrompt("");
        setConnectedAPIs([]);
        fetchAgents();
        onAgentChanged();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAgent = async (id: string) => {
    try {
      await fetch(`/api/agents/${id}`, { method: "DELETE" });
      fetchAgents();
      onAgentChanged();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Create / Customize Form */}
      <div className="lg:col-span-7">
        <div className="cyber-panel rounded-xl p-5 bg-[#0f1e36]/80 border border-[#1e3b63]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyber-cyan" />
              <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider">
                LLM Agent Creation Studio
              </h3>
            </div>
            <span className="text-[10px] font-mono text-cyber-cyan bg-cyber-cyan/15 px-2 py-0.5 rounded border border-cyber-cyan/20">
              SCHEMA V2 ACTIVE
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Agent Node Name</label>
                <input
                  id="agent-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#070d19]/80 border border-[#1e3b63] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyber-cyan"
                  placeholder="e.g. Lead Routing Agent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Operational Role</label>
                <input
                  id="agent-role-input"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#070d19]/80 border border-[#1e3b63] rounded px-3 py-1.5 text-xs text-white focus:outline-none"
                  placeholder="e.g. Customer Dispatcher"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Base LLM Engine</label>
                <select
                  id="agent-model-select"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-[#070d19]/80 border border-[#1e3b63] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="gemini-3.5-flash">Gemini 3.5 Flash (Recommended)</option>
                  <option value="gemini-3.1-flash-tts-preview">Gemini 3.1 Audio/TTS</option>
                  <option value="gemini-3.1-flash-live-preview">Gemini 3.1 Real-time Live</option>
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Temperature: {temperature}</label>
                </div>
                <input
                  id="agent-temp-slider"
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-cyber-cyan mt-2"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase block">System Prompt Instructions</label>
              <textarea
                id="agent-prompt-textarea"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                required
                rows={4}
                className="w-full bg-[#070d19]/80 border border-[#1e3b63] rounded p-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyber-cyan resize-none"
                placeholder="Describe your agent behavior, goals, constraints, and JSON schema boundaries..."
              />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Bound integrations (API triggers)</span>
              <div className="grid grid-cols-3 gap-2">
                {availableAPIs.map((api) => {
                  const isChecked = connectedAPIs.includes(api);
                  return (
                    <button
                      id={`btn-toggle-api-${api.replace(/\s+/g, "-")}`}
                      type="button"
                      key={api}
                      onClick={() => handleToggleAPI(api)}
                      className={`py-1.5 px-2 rounded border text-[10px] font-mono truncate text-center transition-all ${
                        isChecked
                          ? "bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan"
                          : "bg-[#070d19]/50 border-[#1e3b63]/50 text-slate-400 hover:text-white"
                      }`}
                    >
                      {api}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {success ? (
                <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/20">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Agent compiled and deployed!</span>
                </div>
              ) : (
                <div className="text-[10px] font-mono text-slate-500">
                  Clicking compile creates a hot-reload deployment.
                </div>
              )}

              <button
                id="btn-submit-agent"
                type="submit"
                disabled={isLoading || !name || !systemPrompt}
                className="bg-gradient-to-r from-cyber-blue to-cyber-cyan text-white hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] font-display text-xs font-semibold uppercase tracking-wider py-2 px-5 rounded-lg transition-all cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Compiling Node...</span>
                  </span>
                ) : (
                  <span>Compile & Deploy Agent Node</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Deployed agents list */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="cyber-panel rounded-xl p-5 bg-[#0f1e36]/80 border border-[#1e3b63] flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider">
              Deployed AI Node Registries
            </h4>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
              CLUSTER NORMAL
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 max-h-96 pr-1">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="p-3.5 rounded-xl bg-[#070d19]/60 border border-[#1e3b63]/60 hover:border-cyber-cyan/40 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="text-xs font-display font-bold text-white tracking-wide">
                      {agent.name}
                    </h5>
                    <p className="text-[9px] font-mono text-cyber-cyan mt-0.5">
                      {agent.role}
                    </p>
                  </div>

                  <button
                    id={`btn-delete-agent-${agent.id}`}
                    onClick={() => handleDeleteAgent(agent.id)}
                    className="text-slate-500 hover:text-rose-500 p-1 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[10px] text-slate-300 font-sans mt-2 line-clamp-2 leading-relaxed">
                  {agent.systemPrompt}
                </p>

                <div className="mt-3 pt-2.5 border-t border-[#1e3b63]/40 flex items-center justify-between text-[9px] font-mono text-slate-400">
                  <span>MODEL: {agent.model}</span>
                  <span className="bg-[#0f1e36] px-1.5 py-0.5 rounded text-slate-400 border border-[#1e3b63]/40">
                    TEMP: {agent.temperature}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
