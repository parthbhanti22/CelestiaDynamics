import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { Settings, Play, RotateCcw, Crosshair } from 'lucide-react';

export const ProjectileMotion: React.FC = () => {
  const { simConfig, updateSimConfig } = useStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0); // Current simulation time in seconds
  
  // Reset simulation
  const handleReset = () => {
    setIsSimulating(false);
    timeRef.current = 0;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    drawFrame(); // Draw initial state
  };

  // Start simulation
  const handleLaunch = () => {
    // Reset time to 0 to ensure a fresh launch every time
    timeRef.current = 0;
    setIsSimulating(true);
  };

  const drawFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Physics constants from store
    const v0 = simConfig.velocity;
    const theta = (simConfig.angle * Math.PI) / 180;
    const g = simConfig.gravity;
    
    // Canvas settings
    const scale = 4; // Pixels per meter
    const originX = 60;
    const originY = canvas.height - 60;

    // 1. Clear Canvas
    ctx.fillStyle = '#020617'; // Slate-950
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 2. Draw Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x += 50) {
        ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
    }
    for (let y = 0; y < canvas.height; y += 50) {
        ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();

    // 3. Draw Ground
    ctx.strokeStyle = '#06b6d4'; // Cyan-500
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(canvas.width, originY);
    ctx.stroke();
    
    // 4. Draw Predicted Path (Dotted Line)
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    
    const totalFlightTime = (2 * v0 * Math.sin(theta)) / g;
    // Draw slightly past the impact point
    for (let t = 0; t <= totalFlightTime + 0.5; t += 0.1) {
        const dx = v0 * Math.cos(theta) * t;
        const dy = (v0 * Math.sin(theta) * t) - (0.5 * g * t * t);
        const px = originX + dx * scale;
        const py = originY - dy * scale;
        
        if (py > originY && t > 0.1) break; 
        
        ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 5. Draw Projectile (Current State)
    const t = timeRef.current;
    const x = v0 * Math.cos(theta) * t;
    const y = (v0 * Math.sin(theta) * t) - (0.5 * g * t * t);
    
    const canvasX = originX + x * scale;
    const canvasY = originY - y * scale;

    // Check collision with ground
    if (canvasY > originY) {
        // Stop at ground
        setIsSimulating(false);
        // Draw impact
        ctx.beginPath();
        ctx.arc(originX + (v0 * Math.cos(theta) * totalFlightTime) * scale, originY, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
    } else {
        // Draw ball in flight
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24'; // Amber-400
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Draw Velocity Vector
        ctx.beginPath();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.moveTo(canvasX, canvasY);
        const vx = v0 * Math.cos(theta);
        const vy = (v0 * Math.sin(theta)) - (g * t);
        // Normalize vector length for display
        const vMag = Math.sqrt(vx*vx + vy*vy);
        const displayLen = 40;
        ctx.lineTo(canvasX + (vx/vMag)*displayLen, canvasY - (vy/vMag)*displayLen);
        ctx.stroke();
    }

    // 6. Draw Cannon/Origin
    ctx.beginPath();
    ctx.arc(originX, originY, 4, 0, Math.PI*2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    
    // Advance time if simulating
    if (isSimulating) {
        timeRef.current += 0.08; // Time step
        animationRef.current = requestAnimationFrame(drawFrame);
    }
  };

  // Initial draw and config update handling
  useEffect(() => {
    if (!isSimulating) {
        // If we change config while NOT simulating, redraw the preview immediately
        drawFrame();
    }
  }, [simConfig, isSimulating]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-4">
      <div className="relative w-full max-w-6xl aspect-video border border-white/10 rounded-xl overflow-hidden shadow-2xl bg-slate-900 group">
        <canvas ref={canvasRef} width={1280} height={720} className="w-full h-full" />
        
        {/* Playback Controls (Overlay - Center) */}
        {!isSimulating && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                 <button 
                    onClick={handleLaunch}
                    className="flex items-center gap-3 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold text-xl shadow-[0_0_30px_rgba(8,145,178,0.6)] transition-all hover:scale-105 active:scale-95 border border-white/20"
                 >
                    <Play fill="currentColor" /> {timeRef.current > 0 ? 'Re-Launch Projectile' : 'Launch Projectile'}
                 </button>
             </div>
        )}

        {/* Reset Button (Bottom Right) */}
        {(isSimulating || timeRef.current > 0) && (
            <div className="absolute bottom-8 right-8 z-20">
                <button 
                    onClick={handleReset}
                    className="p-4 bg-slate-800 hover:bg-slate-700 text-white rounded-full shadow-lg border border-white/10 transition-all hover:rotate-180"
                    title="Reset Simulation"
                >
                    <RotateCcw size={24} />
                </button>
            </div>
        )}

        {/* Config Panel (Top Left) */}
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-white/10 p-5 rounded-xl w-72 shadow-xl transition-opacity opacity-100 z-20">
           <div className="flex items-center gap-2 mb-6 text-cyan-400 font-bold tracking-wider uppercase text-xs">
             <Settings size={14} /> Kinematics Configuration
           </div>
           
           <div className="space-y-6">
             <div className="relative">
               <label className="text-xs text-slate-400 flex justify-between mb-2">
                 <span>Velocity ($v_0$)</span>
                 <span className="text-white font-mono">{simConfig.velocity} m/s</span>
               </label>
               <input 
                 type="range" min="10" max="150" value={simConfig.velocity} 
                 onChange={e => { updateSimConfig({ velocity: Number(e.target.value) }); handleReset(); }}
                 className="w-full h-1.5 bg-slate-700 rounded-full appearance-none accent-cyan-500"
               />
             </div>
             
             <div>
               <label className="text-xs text-slate-400 flex justify-between mb-2">
                 <span>Launch Angle ($\theta$)</span>
                 <span className="text-white font-mono">{simConfig.angle}°</span>
               </label>
               <input 
                 type="range" min="0" max="90" value={simConfig.angle} 
                 onChange={e => { updateSimConfig({ angle: Number(e.target.value) }); handleReset(); }}
                 className="w-full h-1.5 bg-slate-700 rounded-full appearance-none accent-purple-500"
               />
             </div>
             
             <div>
               <label className="text-xs text-slate-400 flex justify-between mb-2">
                 <span>Gravity ($g$)</span>
                 <span className="text-white font-mono">{simConfig.gravity} m/s²</span>
               </label>
               <input 
                 type="range" min="1.6" max="25" step="0.1" value={simConfig.gravity} 
                 onChange={e => { updateSimConfig({ gravity: Number(e.target.value) }); handleReset(); }}
                 className="w-full h-1.5 bg-slate-700 rounded-full appearance-none accent-pink-500"
               />
             </div>

             <div className="pt-2 border-t border-white/10">
                <button 
                  onClick={handleLaunch}
                  disabled={isSimulating}
                  className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isSimulating ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/40'}`}
                >
                  <Crosshair size={16} /> {isSimulating ? 'In Flight...' : 'Fire Cannon'}
                </button>
             </div>
           </div>
        </div>
        
        {/* Real-time Stats (Top Right) */}
        <div className="absolute top-4 right-4 text-right z-10">
            <div className="text-4xl font-black text-white/10 font-mono select-none">
                T+{timeRef.current.toFixed(2)}s
            </div>
        </div>
      </div>
    </div>
  );
};