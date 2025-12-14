import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { Flame, Snowflake } from 'lucide-react';

const GRID_SIZE = 50;

export const ThermalSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<number[]>(new Array(GRID_SIZE * GRID_SIZE).fill(0));
  const { simConfig } = useStore();
  const requestRef = useRef<number>(0);
  
  // Heat source interaction
  const addHeat = (x: number, y: number, amount: number) => {
     setGrid(prev => {
         const next = [...prev];
         const idx = y * GRID_SIZE + x;
         if (idx >= 0 && idx < next.length) {
             next[idx] = Math.min(100, Math.max(0, next[idx] + amount));
         }
         return next;
     });
  };

  useEffect(() => {
      const animate = () => {
          setGrid(prev => {
              const next = [...prev];
              // Simple diffusion algorithm
              for(let y=1; y<GRID_SIZE-1; y++) {
                  for(let x=1; x<GRID_SIZE-1; x++) {
                      const idx = y * GRID_SIZE + x;
                      const avg = (
                          prev[idx-1] + prev[idx+1] + 
                          prev[idx-GRID_SIZE] + prev[idx+GRID_SIZE]
                      ) / 4;
                      // Heat moves from hot to cold based on conductivity
                      next[idx] = prev[idx] + (avg - prev[idx]) * simConfig.materialConductivity;
                      // Cooling factor
                      next[idx] *= 0.99; 
                  }
              }
              return next;
          });
          requestRef.current = requestAnimationFrame(animate);
      }
      requestRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(requestRef.current);
  }, [simConfig.materialConductivity]);

  useEffect(() => {
      const canvas = canvasRef.current;
      if(!canvas) return;
      const ctx = canvas.getContext('2d');
      if(!ctx) return;
      
      const cellW = canvas.width / GRID_SIZE;
      const cellH = canvas.height / GRID_SIZE;

      // Render
      for(let i=0; i<grid.length; i++) {
          const x = (i % GRID_SIZE) * cellW;
          const y = Math.floor(i / GRID_SIZE) * cellH;
          const temp = grid[i];
          
          // Heatmap Color: Blue (Cold) -> Red (Hot)
          const r = Math.min(255, temp * 2.55 * 2); 
          const b = Math.max(0, 255 - temp * 2.55 * 2);
          
          ctx.fillStyle = `rgb(${r}, 50, ${b})`;
          ctx.fillRect(x, y, cellW, cellH);
      }
  }, [grid]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-4">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Flame className="text-orange-500" /> Thermal Diffusion Simulation
        </h2>
        
        <div className="relative group">
            <canvas 
                ref={canvasRef} 
                width={600} 
                height={600} 
                className="rounded-xl shadow-2xl cursor-crosshair border border-white/20"
                onMouseMove={(e) => {
                    if (e.buttons === 1) { // Left click adds heat
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = Math.floor((e.clientX - rect.left) / (rect.width / GRID_SIZE));
                        const y = Math.floor((e.clientY - rect.top) / (rect.height / GRID_SIZE));
                        addHeat(x, y, 100);
                    }
                }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white font-bold rounded-xl">
                Click & Drag to add Heat
            </div>
        </div>

        <div className="mt-6 flex items-center gap-4 bg-slate-900/80 p-4 rounded-xl border border-white/10">
            <Snowflake className="text-blue-400" size={20} />
            <input 
                type="range" 
                min="0.01" 
                max="0.99" 
                step="0.01"
                className="w-48 h-2 bg-slate-700 rounded-full appearance-none accent-orange-500"
                value={simConfig.materialConductivity}
                onChange={(e) => useStore.getState().updateSimConfig({ materialConductivity: parseFloat(e.target.value) })}
            />
            <Flame className="text-red-500" size={20} />
            <span className="text-xs text-slate-400 uppercase">Conductivity</span>
        </div>
    </div>
  );
};