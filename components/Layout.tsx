import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { ViewState } from '../types';
import { Atom, Globe, Maximize2, BookOpen, Activity, Grid, Zap, Layers, ChevronDown, Menu, X, ExternalLink } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentView, setView } = useStore();
  const [simMenuOpen, setSimMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setMobileMenuOpen(false);
  };

  const navItemClass = (isActive: boolean) => 
    `text-sm font-bold tracking-widest uppercase transition-colors duration-300 ${isActive ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1' : 'text-slate-300 hover:text-white'}`;

  // Close mobile menu on escape or resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full h-[100dvh] bg-deep-space text-white overflow-hidden font-sans selection:bg-cosmic-magenta selection:text-white">
      {/* Cinematic Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2048')] bg-cover bg-center bg-no-repeat pointer-events-none opacity-40" 
      />
      
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[60] p-4 lg:p-6 flex justify-between items-center bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div 
            onClick={() => { setView(ViewState.HOME); setMobileMenuOpen(false); }}
            className="cursor-pointer group flex items-center gap-2"
        >
            <h1 className="font-display text-lg md:text-2xl font-black tracking-tighter text-white">
                CELESTIA<span className="font-light text-cyan-500">DYNAMICS</span>
            </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <button onClick={() => setView(ViewState.HOME)} className={navItemClass(currentView === ViewState.HOME)}>Home</button>
          <button onClick={() => setView(ViewState.ABOUT)} className={navItemClass(currentView === ViewState.ABOUT)}>About</button>
          
          <div 
            className="relative"
            onMouseEnter={() => setSimMenuOpen(true)}
            onMouseLeave={() => setSimMenuOpen(false)}
          >
            <button
              onClick={() => setSimMenuOpen(!simMenuOpen)}
              className={`flex items-center gap-1 h-full py-2 ${navItemClass(simulations.some(s => s.id === currentView))}`}
            >
              Simulations <ChevronDown size={14} className={`transition-transform duration-300 ${simMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown with invisible padding-top bridge to prevent closing on gap transition */}
            {simMenuOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-64 z-50">
                <div className="bg-slate-950 border border-white/10 p-2 shadow-2xl rounded-lg animate-in fade-in slide-in-from-top-2">
                  {simulations.map((sim) => (
                    <button
                      key={sim.id}
                      onClick={() => handleSimClick(sim.id)}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-xs font-bold uppercase tracking-wider text-left transition-colors rounded-md ${currentView === sim.id ? 'bg-cyan-600/20 text-cyan-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                    >
                      <sim.icon size={14} />
                      {sim.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button onClick={() => setView(ViewState.THEORY)} className={navItemClass(currentView === ViewState.THEORY)}>Theory</button>
          <button onClick={() => setView(ViewState.BLOG)} className={navItemClass(currentView === ViewState.BLOG)}>Blog</button>
        </div>

        {/* Mobile Nav Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sign In (Desktop) */}
        <button 
            onClick={() => setView(ViewState.SIGN_IN)}
            className="hidden lg:block px-5 py-2 bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-cyan-400 transition-all rounded-sm">
            Terminal Access
        </button>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 z-[55] bg-black/95 backdrop-blur-2xl transition-transform duration-500 lg:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full pt-24 p-8 overflow-y-auto">
          <div className="flex flex-col gap-6">
            <button onClick={() => { setView(ViewState.HOME); setMobileMenuOpen(false); }} className="text-3xl font-black uppercase tracking-tighter text-left">Home</button>
            <div className="h-px bg-white/10 my-2" />
            <p className="text-xs font-bold text-cyan-500 uppercase tracking-widest">Scientific Modules</p>
            {simulations.map((sim) => (
              <button
                key={sim.id}
                onClick={() => handleSimClick(sim.id)}
                className={`flex items-center gap-4 text-xl font-bold uppercase tracking-tight text-left ${currentView === sim.id ? 'text-cyan-400' : 'text-slate-400'}`}
              >
                <sim.icon size={20} />
                {sim.label}
              </button>
            ))}
            <div className="h-px bg-white/10 my-2" />
            <button onClick={() => { setView(ViewState.THEORY); setMobileMenuOpen(false); }} className="text-3xl font-black uppercase tracking-tighter text-left">Theory Hub</button>
            <button onClick={() => { setView(ViewState.BLOG); setMobileMenuOpen(false); }} className="text-3xl font-black uppercase tracking-tighter text-left">Logs</button>
            <button onClick={() => { setView(ViewState.ABOUT); setMobileMenuOpen(false); }} className="text-3xl font-black uppercase tracking-tighter text-left">About</button>
            <button 
              onClick={() => { setView(ViewState.SIGN_IN); setMobileMenuOpen(false); }} 
              className="mt-8 px-6 py-4 bg-cyan-600 text-white font-black uppercase tracking-widest text-center rounded-xl"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <main className="relative z-10 w-full h-full pt-16 lg:pt-24 flex flex-col overflow-hidden">
        <div className="flex-1 relative w-full overflow-hidden">
            {children}
        </div>
        
        {/* Footer (Simplified for mobile) */}
        <footer className="w-full py-3 bg-black/80 backdrop-blur-md border-t border-white/5 text-center shrink-0 z-50">
            <p className="text-[9px] lg:text-[10px] uppercase tracking-[0.2em] text-slate-500 px-4">
                &copy; Celestia Dynamics <span className="mx-2">|</span> <span className="text-cyan-500 font-bold">Parth Bhanti</span>
            </p>
        </footer>
      </main>
    </div>
  );
};