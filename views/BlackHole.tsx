import React, { useMemo, useState } from 'react';
import { Canvas, ThreeElements } from '@react-three/fiber';
import { OrbitControls, Stars, MeshDistortMaterial, Float } from '@react-three/drei';
import { useStore } from '../store';
import { Settings, Info, X, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';
import { LatexRenderer } from '../components/math/LatexRenderer';
import * as THREE from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

const G = 6.674e-11;
const C = 2.998e8;
const SOLAR_MASS = 1.989e30;

const BlackHoleScene = () => {
  const { simConfig } = useStore();
  
  // Visual Scaling
  const visualRadius = useMemo(() => Math.max(0.5, simConfig.mass * 0.15), [simConfig.mass]);
  const accretionColor = new THREE.Color('#ff5500').lerp(new THREE.Color('#00ffff'), simConfig.spin);

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      
      {/* Event Horizon */}
      <mesh>
        <sphereGeometry args={[visualRadius, 64, 64]} />
        <meshStandardMaterial color="black" roughness={0} metalness={1} />
      </mesh>

      {/* Ergosphere */}
      {simConfig.spin > 0.05 && (
        <mesh>
          <sphereGeometry args={[visualRadius * (1 + 0.6 * simConfig.spin), 64, 64]} />
          <MeshDistortMaterial 
            color="#a855f7" 
            transparent 
            opacity={0.2 * simConfig.spin} 
            distort={0.2} 
            speed={2} 
            roughness={0.1}
          />
        </mesh>
      )}

      {/* Lensing Effect */}
      <mesh>
        <sphereGeometry args={[visualRadius * 1.5, 64, 64]} />
        <MeshDistortMaterial 
          color="black" 
          transparent 
          opacity={0.1} 
          distort={0.3 + (simConfig.mass/100)} 
          speed={1} 
          side={THREE.BackSide}
        />
      </mesh>

      {/* Accretion Disk */}
      {simConfig.accretionDisk && (
        <group rotation={[Math.PI / 3, 0, 0]}>
          <mesh>
            <torusGeometry args={[visualRadius * 4, visualRadius * 1.2, 2, 120]} />
            <meshBasicMaterial color={accretionColor} transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
             <points>
                <torusGeometry args={[visualRadius * 4.5, visualRadius * 2, 32, 200]} />
                <pointsMaterial size={0.03} color={accretionColor} transparent opacity={0.3} sizeAttenuation />
             </points>
          </Float>
        </group>
      )}

      <Stars radius={200} depth={50} count={5000} factor={4} saturation={0} fade />
      <OrbitControls minDistance={5} maxDistance={100} makeDefault />
    </>
  );
};

export const BlackHoleSimulation: React.FC = () => {
  const { simConfig, updateSimConfig } = useStore();
  const [showInfo, setShowInfo] = useState(false);
  const [panelExpanded, setPanelExpanded] = useState(true);
  
  const realRs = (2 * G * (simConfig.mass * SOLAR_MASS)) / (Math.pow(C, 2));
  const rsInKm = (realRs / 1000).toFixed(2);

  return (
    <div className="w-full h-full relative bg-black overflow-hidden touch-none">
      <Canvas camera={{ position: [0, 5, 25], fov: 40 }}>
        <BlackHoleScene />
      </Canvas>

      {/* Responsive Control Layout */}
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 lg:p-8">
        
        {/* Top Info Button */}
        <div className="flex justify-end">
          <button 
            onClick={() => setShowInfo(true)}
            className="pointer-events-auto bg-slate-900/80 backdrop-blur text-cyan-400 p-3 lg:p-4 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all shadow-lg group"
          >
            <Info size={24} />
          </button>
        </div>

        {/* Bottom/Right Settings Panel */}
        <div className="flex justify-center lg:justify-end">
          <div className={`pointer-events-auto w-full max-w-sm lg:w-80 bg-slate-900/90 backdrop-blur-xl border border-white/10 p-5 lg:p-6 rounded-2xl shadow-2xl transition-all ${!panelExpanded ? 'h-14 lg:h-14 overflow-hidden' : 'h-auto'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-cyan-400">
                <Settings size={20} />
                <h3 className="font-black text-xs lg:text-sm uppercase tracking-widest">Metrics Panel</h3>
              </div>
              <button onClick={() => setPanelExpanded(!panelExpanded)} className="text-slate-500 hover:text-white">
                {panelExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </button>
            </div>

            <div className="space-y-4 lg:space-y-6">
              <div>
                <label className="flex justify-between text-[10px] lg:text-xs font-bold text-slate-400 mb-2 uppercase tracking-tighter">
                  <span>Mass (M<sub>☉</sub>)</span>
                  <span className="font-mono text-cyan-300">{simConfig.mass}</span>
                </label>
                <input
                  type="range" min="1" max="50" step="0.5" value={simConfig.mass}
                  onChange={(e) => updateSimConfig({ mass: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div>
                <label className="flex justify-between text-[10px] lg:text-xs font-bold text-slate-400 mb-2 uppercase tracking-tighter">
                  <span>Spin ($a$)</span>
                  <span className="font-mono text-purple-300">{simConfig.spin.toFixed(2)}</span>
                </label>
                <input
                  type="range" min="0" max="1" step="0.01" value={simConfig.spin}
                  onChange={(e) => updateSimConfig({ spin: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Disk Rendering</span>
                <button
                  onClick={() => updateSimConfig({ accretionDisk: !simConfig.accretionDisk })}
                  className={`w-10 h-5 lg:w-12 lg:h-6 rounded-full transition-colors relative ${simConfig.accretionDisk ? 'bg-cyan-600' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 lg:w-5 lg:h-5 bg-white rounded-full transition-transform ${simConfig.accretionDisk ? 'translate-x-5 lg:translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="p-4 bg-cyan-900/10 rounded-xl border border-cyan-500/20">
                <span className="text-cyan-500 text-[10px] font-black block uppercase tracking-tighter mb-1">Schwarzschild Calculation</span>
                <span className="text-2xl font-mono text-white leading-none">{rsInKm} <span className="text-xs text-slate-500 uppercase">km</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
           <div className="bg-slate-950 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
              <div className="p-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-slate-950/95 backdrop-blur z-10">
                 <h2 className="text-xl font-black text-white uppercase tracking-tighter">Singularity Analysis</h2>
                 <button onClick={() => setShowInfo(false)} className="p-2 hover:bg-white/10 rounded-full text-slate-400">
                    <X size={24} />
                 </button>
              </div>
              <div className="p-6 lg:p-8 space-y-8">
                 <section>
                    <h3 className="text-lg font-bold text-cyan-400 mb-2 uppercase tracking-widest">The Horizon</h3>
                    <p className="text-slate-300 mb-4 text-sm leading-relaxed">Boundary of no return. Gravity becomes so intense that light cannot escape.</p>
                    <div className="bg-slate-900 p-4 rounded-xl flex justify-center">
                       <LatexRenderer expression="R_s = \frac{2GM}{c^2}" block={true} />
                    </div>
                 </section>
                 <section>
                    <h3 className="text-lg font-bold text-purple-400 mb-2 uppercase tracking-widest">Kerr Geometry</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">Rotating black holes drag the fabric of spacetime, creating an Ergosphere where physics is warped by angular momentum.</p>
                 </section>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};