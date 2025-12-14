import React, { useState } from 'react';
import { TheoryItem } from '../types';
import { LatexRenderer } from './math/LatexRenderer';
import { explainPhysicsConcept } from '../services/geminiService';
import { Bot, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface TheoryCardProps {
  item: TheoryItem;
}

export const TheoryCard: React.FC<TheoryCardProps> = ({ item }) => {
  const [showDerivation, setShowDerivation] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleAskAI = async () => {
    if (aiExplanation) return; // Already fetched
    setLoadingAi(true);
    const explanation = await explainPhysicsConcept(item.title, item.latex);
    setAiExplanation(explanation);
    setLoadingAi(false);
  };

  const renderAiResponse = (text: string) => {
    // Split by $...$ to detect inline math
    const parts = text.split(/\$([^\$]+)\$/g);
    return parts.map((part, index) => {
      // Odd indices are the captured math content
      if (index % 2 === 1) {
        return <LatexRenderer key={index} expression={part} block={false} />;
      }
      // Even indices are regular text
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl p-8 mb-8 hover:border-cyan-500/30 transition-colors shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
        <div>
           <h2 className="text-3xl font-bold text-white tracking-wide mb-2">{item.title}</h2>
           <p className="text-slate-400 text-sm leading-relaxed max-w-xl">{item.description}</p>
        </div>
        <div className="flex gap-2 shrink-0">
             <button
              onClick={handleAskAI}
              disabled={loadingAi}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 rounded-lg text-sm transition-all h-fit"
            >
              {loadingAi ? <Sparkles className="animate-spin" size={16} /> : <Bot size={16} />}
              Ask AI
            </button>
        </div>
      </div>

      {/* Main Equation Area - Block Display */}
      <div className="p-8 bg-black/40 rounded-xl border border-white/5 mb-6 flex justify-center items-center min-h-[100px]">
         <div className="text-xl md:text-2xl text-cyan-100">
            <LatexRenderer expression={item.latex} block={true} />
         </div>
      </div>

      {/* Controls */}
      <div className="border-t border-white/5 pt-4">
        <button
          onClick={() => setShowDerivation(!showDerivation)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group w-full"
        >
          {showDerivation ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span className="uppercase tracking-widest font-semibold text-xs group-hover:text-cyan-400 transition-colors">
            {showDerivation ? 'Hide Mathematical Derivation' : 'View Mathematical Derivation'}
          </span>
        </button>
      </div>

      {/* AI Response Section */}
      {aiExplanation && (
        <div className="mt-6 p-6 rounded-xl bg-purple-900/10 border border-purple-500/20 animate-in fade-in slide-in-from-top-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
          <div className="flex items-center gap-2 mb-3 text-purple-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles size={12} /> AI Explanation
          </div>
          <p className="text-slate-200 text-sm leading-relaxed">
            {renderAiResponse(aiExplanation)}
          </p>
        </div>
      )}

      {/* Derivation Dropdown */}
      {showDerivation && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-4">
          <div className="space-y-4 pl-4 border-l border-white/10">
            {item.derivation.map((step, idx) => (
              <div key={idx} className="flex flex-col gap-1 group">
                <span className="text-[10px] font-mono text-slate-600 group-hover:text-cyan-500/50 transition-colors uppercase">Step {idx + 1}</span>
                <div className="text-slate-300 text-lg">
                   <LatexRenderer expression={step} block={false} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};