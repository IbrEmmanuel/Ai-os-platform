import React, { useState, useEffect } from "react";
import { Radio, RefreshCw, Layers, CheckCircle2, AlertCircle, ToggleLeft, ToggleRight } from "lucide-react";

interface ApiHubProps {
  onChanged: () => void;
}

export default function ApiHub({ onChanged }: ApiHubProps) {
  const [activeAPIs, setActiveAPIs] = useState<string[]>([]);
  const [triggers, setTriggers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchAPIData();
  }, []);

  const fetchAPIData = async () => {
    try {
      const response = await fetch("/api/integrations");
      const data = await response.json();
      setActiveAPIs(data.activeAPIs);
      setTriggers(data.triggers);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleAPI = async (apiName: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/integrations/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: apiName }),
      });

      const data = await response.json();
      if (data.success) {
        setActiveAPIs(data.activeAPIs);
        onChanged(); // Refresh log terminals
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const allAPIs = [
    { name: "Slack Webhook", icon: "Slack", category: "Outbound Webhook" },
    { name: "SendGrid Mailer", icon: "Mail", category: "Communication" },
    { name: "Vector Engine", icon: "Database", category: "RAG Pipeline" },
    { name: "Twilio SIP", icon: "Phone", category: "Telecom Voice" },
    { name: "GitHub API", icon: "Github", category: "Repository Hooks" },
  ];

  return (
    <div className="cyber-panel rounded-xl p-5 bg-[#0f1e36]/80 border border-[#1e3b63] h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyber-cyan animate-pulse" />
            <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider">
              Web and Business API Hub
            </h3>
          </div>
          <span className="text-[9px] font-mono text-[#00f0ff] bg-cyber-cyan/15 px-2 py-0.5 rounded border border-cyber-cyan/30">
            {isLoading ? "SYNCING..." : "INTEGRATION MANAGER"}
          </span>
        </div>

        {/* List of APIs */}
        <div className="space-y-3 mb-5">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">
            Connected API Services
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {allAPIs.map((api) => {
              const isConnected = activeAPIs.includes(api.name);
              return (
                <div
                  key={api.name}
                  className="p-3 rounded-lg bg-[#070d19]/60 border border-[#1e3b63]/40 flex items-center justify-between hover:border-[#1e3b63] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        isConnected ? "bg-cyber-cyan animate-pulse shadow-[0_0_8px_#00f0ff]" : "bg-slate-700"
                      }`}
                    />
                    <div>
                      <div className="text-xs font-semibold text-white">{api.name}</div>
                      <div className="text-[8px] font-mono text-slate-500 uppercase">{api.category}</div>
                    </div>
                  </div>

                  <button
                    id={`btn-toggle-api-hub-${api.name.replace(/\s+/g, "-")}`}
                    onClick={() => handleToggleAPI(api.name)}
                    disabled={isLoading}
                    className={`p-1 transition-colors ${
                      isConnected ? "text-cyber-cyan" : "text-slate-500 hover:text-slate-400"
                    }`}
                  >
                    {isConnected ? (
                      <ToggleRight className="w-8 h-8 cursor-pointer" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 cursor-pointer" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* API triggers list */}
      <div className="p-3 bg-[#070d19]/80 border border-[#1e3b63]/40 rounded-lg">
        <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-2">
          Active Ingress Webhooks / Triggers
        </div>

        <div className="space-y-1.5 max-h-24 overflow-y-auto">
          {triggers.map((t) => (
            <div key={t.id} className="flex items-center justify-between text-[10px] font-mono text-slate-300">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t.name}
              </span>
              <span className="text-slate-500 text-[9px]">{t.lastTrigger}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
