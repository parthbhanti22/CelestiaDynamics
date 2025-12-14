import React, { useState } from 'react';
import { useStore } from '../store';
import { ViewState } from '../types';
import { Atom, Globe, Maximize2, BookOpen, Activity, Grid, Zap, Layers, ChevronDown, FileText, User } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentView, setView } = useStore();
  const [simMenuOpen, setSimMenuOpen] = useState(false);

  // Group simulations
  const simulations = [
    { id: ViewState.SIM_BLACKHOLE, label: 'Black Hole', icon: Maximize2 },
    { id: ViewState.SIM_PROJECTILE, label: 'Projectile Motion', icon: Activity },
    { id: ViewState.SIM_ATOMIC, label: 'Quantum Atom', icon: Atom },
    { id: ViewState.SIM_THERMAL, label: 'Thermal Dynamics', icon: Grid },
    { id: ViewState.SIM_PENROSE, label: 'Penrose Multiverse', icon: Layers },
  ];

  const handleSimClick = (id: ViewState) => {
    setView(id);
    setSimMenuOpen(false);
  };

  const navItemClass = (isActive: boolean) => 
    `text-sm font-bold tracking-widest uppercase transition-colors duration-300 ${isActive ? 'text-white border-b-2 border-cosmic-magenta pb-1' : 'text-slate-300 hover:text-white'}`;

  return (
    <div className="relative w-full h-screen bg-deep-space text-white overflow-hidden font-sans selection:bg-cosmic-magenta selection:text-white">
      {/* Cinematic Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2048')] bg-cover bg-center bg-no-repeat pointer-events-none" 
      />
      {/* Overlay to ensure text legibility */}
      <div className="fixed inset-0 z-0 bg-black/40 pointer-events-none" />
      
      {/* Main Content Area */}
      <main className="relative z-10 w-full h-full pt-24 pb-0 flex flex-col">
        <div className="flex-1 relative w-full overflow-hidden">
            {children}
        </div>
        
        {/* Footer */}
        <footer className="w-full py-3 bg-black/80 backdrop-blur-md border-t border-white/10 text-center z-50">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                &copy; {new Date().getFullYear()} Celestia Dynamics <span className="mx-2 text-slate-700">|</span> Developed by <span className="text-cyan-500 font-bold">Parth Bhanti</span> <span className="mx-2 text-slate-700">|</span> All Rights Reserved
            </p>
        </footer>
      </main>

      {/* Transparent Cinematic Navbar (Top Fixed) */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        {/* Logo Area */}
        <div 
            onClick={() => setView(ViewState.HOME)}
            className="cursor-pointer group"
        >
            <h1 className="font-display text-2xl font-black tracking-widest text-white group-hover:text-cyan-400 transition-colors">
                CELESTIA<span className="font-light text-slate-400">DYNAMICS</span>
            </h1>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-8 md:gap-12">
          <button onClick={() => setView(ViewState.HOME)} className={navItemClass(currentView === ViewState.HOME)}>
            Home
          </button>

          <button onClick={() => setView(ViewState.ABOUT)} className={navItemClass(currentView === ViewState.ABOUT)}>
            About
          </button>

          <div className="relative">
            <button
              onClick={() => setSimMenuOpen(!simMenuOpen)}
              className={`flex items-center gap-1 ${navItemClass(simulations.some(s => s.id === currentView))}`}
            >
              Simulations <ChevronDown size={14} className={`transition-transform duration-300 ${simMenuOpen ? 'rotate-180' : 'rotate-0'}`} />
            </button>
            
            {/* Dropdown - Solid Dark */}
            {simMenuOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-black border border-white/20 p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 z-50">
                {simulations.map((sim) => (
                  <button
                    key={sim.id}
                    onClick={() => handleSimClick(sim.id)}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-xs font-bold uppercase tracking-wider text-left transition-colors ${currentView === sim.id ? 'bg-cosmic-magenta text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
                  >
                    <sim.icon size={14} />
                    {sim.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => setView(ViewState.THEORY)} className={navItemClass(currentView === ViewState.THEORY)}>
            Theory
          </button>

          <button onClick={() => setView(ViewState.BLOG)} className={navItemClass(currentView === ViewState.BLOG)}>
            Blog
          </button>
        </div>

        {/* Action Button */}
        <button 
            onClick={() => setView(ViewState.SIGN_IN)}
            className="hidden md:block px-6 py-2 bg-transparent border border-white text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
            Sign In
        </button>
      </nav>
    </div>
  );
};