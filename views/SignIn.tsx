import React, { useState } from 'react';
import { useStore } from '../store';
import { ViewState } from '../types';
import { ArrowRight, Fingerprint, Lock } from 'lucide-react';

export const SignIn: React.FC = () => {
  const { setView } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Simulate processing time then redirect to maintenance
      setTimeout(() => {
        setView(ViewState.MAINTENANCE);
      }, 500);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header */}
        <div className="text-center mb-10">
           <h1 className="font-display text-4xl font-black text-white tracking-widest mb-2">
             IDENTIFICATION
           </h1>
           <div className="h-1 w-24 bg-cosmic-magenta mx-auto" />
           <p className="mt-4 text-cyan-400 font-mono text-xs uppercase tracking-[0.2em]">Secure Access Required</p>
        </div>

        {/* Card */}
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
           {/* Decorative corner accents */}
           <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50" />
           <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cosmic-magenta/50" />

           <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Identity Key (Email)</label>
                 <div className="relative">
                    <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-slate-900/50 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:bg-slate-900/80 transition-all font-mono text-sm"
                      placeholder="user@celestia.io"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Access Code</label>
                 <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-slate-900/50 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-cosmic-magenta focus:bg-slate-900/80 transition-all font-mono text-sm"
                      placeholder="••••••••••••"
                    />
                 </div>
              </div>

              <button 
                type="submit"
                className="w-full group/btn relative overflow-hidden bg-white hover:bg-cyan-400 text-black font-bold uppercase tracking-widest py-4 rounded-lg transition-all duration-300 mt-4 flex items-center justify-center gap-2"
              >
                 <span className="relative z-10">Initialize Session</span>
                 <ArrowRight size={16} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
              </button>
           </form>
           
           {/* Scanline effect */}
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent bg-[length:100%_200%] animate-[scan_3s_linear_infinite] pointer-events-none" />
        </div>

        <div className="text-center mt-8 space-y-4">
             <button 
                onClick={() => setView(ViewState.SIGN_UP)}
                className="text-slate-400 text-xs uppercase tracking-widest hover:text-purple-400 transition-colors border-b border-transparent hover:border-purple-400 pb-1"
            >
                No Identity Key? Enlist Now
            </button>
            <p className="text-slate-600 text-[10px]">
                Unauthorized access is a violation of Intergalactic Protocol 72-B.
            </p>
        </div>
      </div>
    </div>
  );
};