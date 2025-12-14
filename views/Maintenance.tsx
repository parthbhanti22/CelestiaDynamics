import React from 'react';
import { useStore } from '../store';
import { ViewState } from '../types';
import { AlertTriangle, Construction, ChevronLeft } from 'lucide-react';

export const Maintenance: React.FC = () => {
  const { setView } = useStore();

  return (
    <div className="w-full h-full flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm relative z-20">
      <div className="max-w-2xl w-full text-center p-12 border-y-2 border-cosmic-magenta bg-black/90 relative overflow-hidden">
        
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(109,0,56,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(109,0,56,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

        <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 mb-8 text-cosmic-magenta animate-pulse">
                <AlertTriangle className="w-full h-full" strokeWidth={1} />
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter uppercase">
                Module <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic-magenta to-red-600">Offline</span>
            </h1>

            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent mb-8" />

            <p className="text-xl text-slate-300 font-light mb-8 max-w-lg leading-relaxed">
                Our quantum engineers are currently calibrating the user authentication capacitors. This sector is under heavy development.
            </p>

            <div className="bg-slate-900/80 border border-white/10 p-4 rounded-lg mb-10 flex items-center gap-4">
                <Construction className="text-yellow-500" size={24} />
                <div className="text-left">
                    <div className="text-xs text-slate-400 uppercase tracking-widest">Status</div>
                    <div className="text-yellow-500 font-mono text-sm">DEVELOPMENT IN PROGRESS • ETA UNKNOWN</div>
                </div>
            </div>

            <button
                onClick={() => setView(ViewState.HOME)}
                className="group flex items-center gap-2 px-8 py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-cyan-400 transition-colors"
            >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Return to Cosmos
            </button>
        </div>
      </div>
    </div>
  );
};