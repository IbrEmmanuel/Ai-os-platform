import React, { useState, useEffect } from "react";
import { Database, Search, Plus, Trash2, Shield, Loader, FileText, Check } from "lucide-react";
import { RAGDocument } from "../types";

export default function RAGEngine() {
  const [documents, setDocuments] = useState<RAGDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("sla response limit");
  const [searchResults, setSearchResults] = useState<{ document: RAGDocument; score: number }[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [docTitle, setDocTitle] = useState<string>("");
  const [docContent, setDocContent] = useState<string>("");
  const [docCategory, setDocCategory] = useState<string>("Technical");
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/rag/documents");
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      console.error("Failed to load documents", err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch("/api/rag/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.results);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docContent.trim()) return;
    setIsAdding(true);
    setSuccessMsg("");

    try {
      const response = await fetch("/api/rag/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: docTitle,
          content: docContent,
          category: docCategory,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMsg("Document indexed and vectorized successfully!");
        setDocTitle("");
        setDocContent("");
        fetchDocuments();
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteDoc = async (id: string) => {
    try {
      await fetch(`/api/rag/documents/${id}`, { method: "DELETE" });
      fetchDocuments();
      setSearchResults((prev) => prev.filter((item) => item.document.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Search Sandbox Playground Panel */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="cyber-panel rounded-xl p-5 bg-[#0f1e36]/80 border border-[#1e3b63] flex-1 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-cyber-cyan" />
                <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider">
                  RAG Vector Search Sandbox
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyber-cyan bg-cyber-cyan/15 px-2 py-0.5 rounded border border-cyber-cyan/30">
                COSINE MATRIX ACTIVE
              </span>
            </div>

            {/* Input search query */}
            <div className="flex gap-2 mb-4">
              <input
                id="rag-search-query-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 bg-[#070d19]/80 border border-[#1e3b63] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyber-cyan transition-colors"
                placeholder="Type query to test vector embedding lookup..."
              />
              <button
                id="btn-rag-search"
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-cyber-cyan hover:bg-[#00d0df] text-[#070d19] font-mono font-bold text-xs uppercase px-4 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isSearching ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Vector search</span>
              </button>
            </div>

            {/* Results */}
            <div className="space-y-3">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Index Retrieval Results
              </div>

              {searchResults.length > 0 ? (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {searchResults.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#070d19]/70 border border-[#1e3b63]/60 hover:border-cyber-cyan/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-cyber-cyan" />
                          <span className="text-xs font-semibold text-white">{item.document.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          SCORE: {item.score.toFixed(3)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                        {item.document.content}
                      </p>
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-2">
                        <span>CATEGORY: {item.document.category}</span>
                        <span>CHARS: {item.document.charCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 border border-dashed border-[#1e3b63]/60 rounded-lg flex flex-col items-center justify-center text-center text-slate-400 bg-[#070d19]/40">
                  <Database className="w-8 h-8 text-slate-500 mb-2 animate-bounce-slow" />
                  <p className="text-xs font-mono uppercase tracking-wider">
                    Ready for Query Run
                  </p>
                  <p className="text-[11px] mt-1 text-slate-500">
                    Type a query (e.g. "pricing", "sla", "nginx") to test database similarity search.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload/Add Knowledge Document and Index List Panel */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Add document form */}
        <div className="cyber-panel rounded-xl p-5 bg-[#0f1e36]/80 border border-[#1e3b63]">
          <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider mb-3">
            Add Knowledge Document
          </h4>
          <form onSubmit={handleAddDocument} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-slate-400 uppercase block">Title</label>
              <input
                id="doc-title-input"
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                required
                className="w-full bg-[#070d19]/80 border border-[#1e3b63] rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyber-cyan"
                placeholder="Enterprise Pricing SLA..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono text-slate-400 uppercase block">Content</label>
              <textarea
                id="doc-content-input"
                value={docContent}
                onChange={(e) => setDocContent(e.target.value)}
                required
                rows={3}
                className="w-full bg-[#070d19]/80 border border-[#1e3b63] rounded p-2 text-xs text-white focus:outline-none focus:border-cyber-cyan resize-none"
                placeholder="Paste reference material content..."
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1 space-y-1">
                <label className="text-[9px] font-mono text-slate-400 uppercase block">Category</label>
                <select
                  id="doc-category-select"
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full bg-[#070d19]/80 border border-[#1e3b63] rounded px-2 py-1 text-xs text-white focus:outline-none"
                >
                  <option value="Technical">Technical</option>
                  <option value="Financial">Financial</option>
                  <option value="Operational">Operational</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  id="btn-add-doc"
                  type="submit"
                  disabled={isAdding}
                  className="w-full bg-gradient-to-r from-cyber-blue to-cyber-cyan text-white hover:shadow-[0_0_10px_rgba(0,240,255,0.3)] font-mono text-xs uppercase px-4 py-1.5 rounded flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Index File</span>
                </button>
              </div>
            </div>

            {successMsg && (
              <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/10 p-1.5 rounded border border-emerald-500/20">
                <Check className="w-3.5 h-3.5" />
                <span>{successMsg}</span>
              </div>
            )}
          </form>
        </div>

        {/* Existing indexed lists */}
        <div className="cyber-panel rounded-xl p-5 bg-[#0f1e36]/80 border border-[#1e3b63] flex-1">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider">
              Document Index Store ({documents.length})
            </h4>
            <span className="text-[9px] font-mono text-slate-500">HNSW INTEGRITY: 100%</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-2 rounded bg-[#070d19]/40 border border-[#1e3b63]/40 text-xs hover:bg-[#070d19]/70 transition-colors"
              >
                <div className="truncate max-w-[200px] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#1e3b63]" />
                  <div>
                    <div className="font-semibold text-slate-200 truncate">{doc.title}</div>
                    <div className="text-[8px] font-mono text-slate-500 uppercase">
                      {doc.category} • {doc.charCount} chars
                    </div>
                  </div>
                </div>
                <button
                  id={`btn-delete-doc-${doc.id}`}
                  onClick={() => handleDeleteDoc(doc.id)}
                  className="text-slate-500 hover:text-rose-500 p-1 rounded hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
