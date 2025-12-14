import React, { useMemo, useState } from 'react';
import { Canvas, ThreeElements } from '@react-three/fiber';
import { OrbitControls, Stars, MeshDistortMaterial, Float } from '@react-three/drei';
import { useStore } from '../store';
import { Settings, Info, X, ExternalLink } from 'lucide-react';
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

      {/* Ergosphere - Region of spacetime dragging (Frame Dragging) */}
      {simConfig.spin > 0.05 && (
        <mesh>
          {/* The ergosphere is oblate, but we simulate it as a pulsating energy shell here */}
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

      {/* Lensing Effect (Simulated via transparent distortion) */}
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
      <OrbitControls minDistance={5} maxDistance={100} />
    </>
  );
};

export const BlackHoleSimulation: React.FC = () => {
  const { simConfig, updateSimConfig } = useStore();
  const [showInfo, setShowInfo] = useState(false);
  
  const realRs = (2 * G * (simConfig.mass * SOLAR_MASS)) / (Math.pow(C, 2));
  const rsInKm = (realRs / 1000).toFixed(2);

  return (
    <div className="w-full h-full relative bg-black">
      <Canvas camera={{ position: [0, 5, 25], fov: 40 }}>
        <BlackHoleScene />
      </Canvas>

      {/* Top Right Controls & Info */}
      <div className="absolute top-24 right-4 flex flex-col items-end gap-4 z-20">
        
        {/* Info Toggle Button */}
        <button 
          onClick={() => setShowInfo(true)}
          className="bg-slate-800/80 backdrop-blur text-cyan-400 p-3 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all shadow-lg group"
        >
          <Info size={24} className="group-hover:scale-110 transition-transform" />
        </button>

        {/* Settings Panel */}
        <div className="w-80 bg-slate-900/80 backdrop-blur-md border border-white/10 p-6 rounded-xl shadow-2xl">
          <div className="flex items-center gap-2 mb-4 text-cyan-400">
            <Settings size={20} />
            <h3 className="font-bold text-lg">Event Horizon Params</h3>
          </div>

          <div className="mb-6">
            <label className="flex justify-between text-sm text-slate-300 mb-2">
              {/* Fixed: Use Unicode circle dot instead of \odot to avoid build syntax errors */}
              <span>Mass (M<sub>☉</sub>)</span>
              <span className="font-mono text-cyan-300">{simConfig.mass}</span>
            </label>
            <input
              type="range"
              min="1"
              max="50"
              step="0.5"
              value={simConfig.mass}
              onChange={(e) => updateSimConfig({ mass: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          <div className="mb-6">
            <label className="flex justify-between text-sm text-slate-300 mb-2">
              <span>Spin Parameter ($a$)</span>
              <span className="font-mono text-purple-300">{simConfig.spin.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={simConfig.spin}
              onChange={(e) => updateSimConfig({ spin: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-slate-300">Accretion Disk</span>
            <button
              onClick={() => updateSimConfig({ accretionDisk: !simConfig.accretionDisk })}
              className={`w-12 h-6 rounded-full transition-colors relative ${simConfig.accretionDisk ? 'bg-cyan-600' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${simConfig.accretionDisk ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="p-4 bg-black/40 rounded-lg border border-white/5">
            <div className="flex items-center gap-2 mb-2 text-xs text-slate-500 uppercase tracking-widest">
              <ExternalLink size={12} /> Live Metrics
            </div>
            <div className="mb-2">
              <span className="text-slate-400 text-xs block">Schwarzschild Radius ($R_s$)</span>
              <span className="text-xl font-mono text-white">{rsInKm} <span className="text-sm text-slate-500">km</span></span>
            </div>
            {simConfig.spin > 0.05 && (
              <div className="mt-2 pt-2 border-t border-white/5">
                <span className="text-purple-400 text-xs block">Ergosphere Active</span>
                <span className="text-[10px] text-slate-500">Frame dragging enabled</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
           <div className="bg-slate-950 border border-white/20 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl relative flex flex-col">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-slate-950/95 backdrop-blur z-10">
                 <div className="flex items-center gap-3">
                    <Info className="text-cyan-400" />
                    <h2 className="text-2xl font-bold text-white tracking-wide">Black Hole Dynamics</h2>
                 </div>
                 <button 
                    onClick={() => setShowInfo(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                 >
                    <X size={24} />
                 </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-8">
                 
                 {/* Schwarzschild Section */}
                 <section>
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                       The Event Horizon
                       <span className="text-xs font-normal text-slate-500 border border-slate-700 px-2 py-0.5 rounded-full uppercase">Metric</span>
                    </h3>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                       The point of no return. Defined by the Schwarzschild radius ($R_s$), this is the boundary where the gravitational pull becomes so strong that the escape velocity exceeds the speed of light ($c$).
                    </p>
                    <div className="bg-slate-900 p-6 rounded-xl border border-white/5 flex justify-center my-4">
                       <LatexRenderer expression="R_s = \frac{2GM}{c^2}" block={true} />
                    </div>
                    <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                       <li><strong className="text-slate-200">G:</strong> Gravitational Constant</li>
                       <li><strong className="text-slate-200">M:</strong> Mass of the black hole</li>
                       <li><strong className="text-slate-200">c:</strong> Speed of light</li>
                    </ul>
                 </section>

                 <div className="h-px bg-white/10" />

                 {/* Spin / Ergosphere Section */}
                 <section>
                    <h3 className="text-xl font-bold text-purple-300 mb-3 flex items-center gap-2">
                       Stellar Spin & The Ergosphere
                       <span className="text-xs font-normal text-purple-900/50 border border-purple-500/30 text-purple-400 px-2 py-0.5 rounded-full uppercase">Kerr Metric</span>
                    </h3>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                       Real black holes rotate. This rotation drags spacetime itself around the black hole, a phenomenon known as <strong className="text-white">Frame Dragging</strong> or the <em>Lense-Thirring effect</em>.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                       The <strong className="text-purple-400">Ergosphere</strong> is an oblate region outside the event horizon where it is impossible to stand still. You are forced to rotate with the black hole, though escape is still theoretically possible from this region.
                    </p>
                 </section>

                 <div className="h-px bg-white/10" />

                 {/* Accretion Disk Section */}
                 <section>
                    <h3 className="text-xl font-bold text-orange-300 mb-3">Accretion Disk</h3>
                    <p className="text-slate-300 leading-relaxed">
                       Matter doesn't usually fall straight in; it spirals. Conservation of angular momentum forms a flattened disk of superheated gas and dust. Friction within this disk heats material to millions of degrees, causing it to glow brightly in X-rays and visible light.
                    </p>
                 </section>

              </div>
           </div>
        </div>
      )}
    </div>
  );
};