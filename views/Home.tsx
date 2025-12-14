import React from 'react';
import { useStore } from '../store';
import { ViewState } from '../types';
import { PlayCircle, Globe, BookOpen } from 'lucide-react';

export const Home: React.FC = () => {
  const { setView } = useStore();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-12 animate-in fade-in duration-1000 px-4">
      <div className="relative z-10 mt-10">
        <h1 className="font-display text-6xl md:text-9xl font-black text-white tracking-widest mb-2 drop-shadow-2xl">
          CELESTIA
        </h1>
        <h2 className="text-xl md:text-3xl font-light tracking-[0.8em] text-cyan-200 uppercase">
          Dynamics
        </h2>
      </div>

      <div className="max-w-2xl bg-black/60 p-8 border-l-4 border-cosmic-magenta backdrop-blur-sm">
        <h3 className="text-white font-bold text-2xl mb-4 uppercase tracking-widest">Explore The Cosmos</h3>
        <p className="text-slate-300 text-lg leading-relaxed">
           Experience the fundamental forces of the universe. From the event horizon of a black hole to the quantum probability fields, visualize the invisible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-8">
        <button 
            onClick={() => setView(ViewState.COSMOS)}
            className="group relative h-64 bg-black border border-white/20 hover:border-cyan-400 transition-all duration-300 overflow-hidden flex flex-col items-center justify-center"
        >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=500')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
            
            <div className="relative z-10 flex flex-col items-center">
                <Globe className="w-12 h-12 text-white mb-6 group-hover:scale-110 transition-transform" />
                <span className="text-2xl font-display font-bold text-white uppercase tracking-widest mb-2">Cosmos</span>
                <span className="text-xs font-bold bg-white text-black px-3 py-1 uppercase tracking-widest group-hover:bg-cyan-400 transition-colors">Explorer</span>
            </div>
        </button>

        <button 
            onClick={() => setView(ViewState.SIM_BLACKHOLE)}
            className="group relative h-64 bg-black border border-white/20 hover:border-purple-400 transition-all duration-300 overflow-hidden flex flex-col items-center justify-center"
        >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614728853913-1e22ba0dae2d?auto=format&fit=crop&q=80&w=500')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity" />
             <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />

            <div className="relative z-10 flex flex-col items-center">
                <PlayCircle className="w-12 h-12 text-white mb-6 group-hover:scale-110 transition-transform" />
                <span className="text-2xl font-display font-bold text-white uppercase tracking-widest mb-2">Simulations</span>
                <span className="text-xs font-bold bg-white text-black px-3 py-1 uppercase tracking-widest group-hover:bg-purple-400 transition-colors">Interact</span>
            </div>
        </button>

        <button 
            onClick={() => setView(ViewState.THEORY)}
            className="group relative h-64 bg-black border border-white/20 hover:border-cosmic-magenta transition-all duration-300 overflow-hidden flex flex-col items-center justify-center"
        >
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=500')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity" />
             <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />

            <div className="relative z-10 flex flex-col items-center">
                <BookOpen className="w-12 h-12 text-white mb-6 group-hover:scale-110 transition-transform" />
                <span className="text-2xl font-display font-bold text-white uppercase tracking-widest mb-2">Theory Hub</span>
                <span className="text-xs font-bold bg-white text-black px-3 py-1 uppercase tracking-widest group-hover:bg-cosmic-magenta group-hover:text-white transition-colors">Learn</span>
            </div>
        </button>
      </div>
    </div>
  );
};