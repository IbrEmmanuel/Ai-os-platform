import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX, Radio, Play, Pause, Activity, RefreshCw } from "lucide-react";

export default function VoiceAgent() {
  const [inputText, setInputText] = useState<string>("Hello, FutureOS agent initialized. Voice channel secure.");
  const [selectedVoice, setSelectedVoice] = useState<string>("Zephyr");
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);

  // Audio elements
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [waveHeights, setWaveHeights] = useState<number[]>(new Array(24).fill(4));

  // Prebuilt voices supported by Gemini 3.1 TTS
  const voices = ["Zephyr", "Kore", "Puck", "Charon", "Fenrir"];

  // Handle dynamic audio waveform movement
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying || isLoading) {
      interval = setInterval(() => {
        setWaveHeights((prev) =>
          prev.map(() => {
            const min = isPlaying ? 5 : 2;
            const max = isPlaying ? 35 : 12;
            return Math.floor(Math.random() * (max - min + 1) + min);
          })
        );
      }, 90);
    } else {
      setWaveHeights(new Array(24).fill(4));
    }
    return () => clearInterval(interval);
  }, [isPlaying, isLoading]);

  const handleSynthesizeSpeech = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setIsPlaying(false);
    setIsSimulated(false);

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    try {
      const response = await fetch("/api/voice/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          voiceName: selectedVoice,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "TTS failed");

      if (data.simulated) {
        setIsSimulated(true);
        // Simulate speech playback
        setIsPlaying(true);
        setTimeout(() => {
          setIsPlaying(false);
        }, 3500);
      } else if (data.audio) {
        // Decode base64 and create Blob
        const binary = atob(data.audio);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        // Gemini TTS outputs PCM or Wav payload depending on envelope.
        // The most robust way in browser is loading it as a Blob.
        const blob = new Blob([bytes], { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Play the audio
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch((err) => console.error("Playback error:", err));
        }
      }
    } catch (err) {
      console.error("Speech Synthesis failure:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const toggleMic = () => {
    setIsMicActive(!isMicActive);
  };

  return (
    <div className="cyber-panel rounded-xl p-5 bg-[#0f1e36]/80 border border-[#1e3b63] h-full flex flex-col justify-between">
      {/* Waveform and Audio playback elements */}
      {audioUrl && (
        <audio
          ref={audioRef}
          onEnded={handleAudioEnded}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          className="hidden"
        />
      )}

      {/* Title */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyber-pink animate-pulse" />
            <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider">
              Voice Call Center AI
            </h3>
          </div>
          <span className="text-[9px] font-mono text-cyber-pink bg-cyber-pink/10 px-2 py-0.5 rounded border border-cyber-pink/20">
            {isPlaying ? "TRANSMITTING" : isLoading ? "SYNTHESIZING" : "SECURE STANDBY"}
          </span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
          Connect outbound voice calls powered by Gemini 3.1 TTS. Speak or type instructions to generate natural responsive dialogue.
        </p>

        {/* Text Voice generation input */}
        <div className="space-y-2 mb-4">
          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
            Synthesized Prompt Input
          </label>
          <div className="relative">
            <input
              id="voice-prompt-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="w-full bg-[#070d19]/80 border border-[#1e3b63] rounded-lg pl-3 pr-10 py-2 text-xs text-white focus:outline-none focus:border-cyber-pink transition-colors font-sans"
              placeholder="Type sentence for the voice agent to synthesize..."
            />
            <button
              id="btn-voice-mic"
              onClick={toggleMic}
              className={`absolute right-1.5 top-1.5 p-1 rounded-md transition-colors ${
                isMicActive
                  ? "bg-cyber-pink/20 text-cyber-pink"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isMicActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Configuration settings (Voice selection, playback speed etc) */}
        <div className="flex gap-4 items-center mb-4">
          <div className="flex-1 space-y-1">
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">
              Core Voice Synthesis
            </span>
            <select
              id="voice-select"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full bg-[#070d19]/80 border border-[#1e3b63] rounded px-2 py-1 text-[11px] text-white font-mono focus:outline-none focus:border-cyber-pink cursor-pointer"
            >
              {voices.map((v) => (
                <option key={v} value={v}>
                  {v} ({v === "Zephyr" ? "Default/Male" : "Prebuilt/Alt"})
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 space-y-1">
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">
              Sampling Rate
            </span>
            <div className="text-[11px] font-mono text-cyber-pink bg-cyber-pink/10 px-2 py-1.5 rounded border border-cyber-pink/20 text-center">
              24,000 Hz HD
            </div>
          </div>
        </div>
      </div>

      {/* Waveform Visualization area */}
      <div className="space-y-4">
        <div className="h-16 bg-[#070d19]/80 border border-[#1e3b63]/50 rounded-lg flex items-center justify-center gap-1.5 px-4 overflow-hidden relative">
          {/* Static backdrop grid lines */}
          <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20" />

          {/* Wave heights mapped bar elements */}
          {waveHeights.map((h, idx) => (
            <div
              key={idx}
              style={{ height: `${h}px` }}
              className={`w-1 rounded-full transition-all duration-100 ${
                isPlaying
                  ? "bg-gradient-to-t from-cyber-pink to-cyber-purple shadow-[0_0_8px_rgba(255,0,127,0.4)]"
                  : isLoading
                  ? "bg-cyber-cyan animate-pulse"
                  : "bg-slate-700"
              }`}
            />
          ))}

          {isLoading && (
            <div className="absolute inset-0 bg-[#070d19]/80 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 text-cyber-pink animate-spin" />
              <span className="text-[10px] font-mono text-slate-300 uppercase tracking-widest">
                Compiling Audio Channels...
              </span>
            </div>
          )}
        </div>

        {/* Run Synthesis action */}
        <div>
          {isSimulated && (
            <div className="text-[9px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded p-1.5 text-center mb-2">
              [Simulation] Real voice requires Gemini API key.
            </div>
          )}
          <button
            id="btn-voice-trigger"
            onClick={handleSynthesizeSpeech}
            disabled={isLoading || !inputText}
            className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 font-display text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              isLoading
                ? "bg-[#1e3b63] text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-cyber-pink to-cyber-purple text-white hover:shadow-[0_0_15px_rgba(255,0,127,0.4)] cursor-pointer"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Voice Stream Output Active</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 shrink-0" />
                <span>Synthesize outbound Dialogue</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
