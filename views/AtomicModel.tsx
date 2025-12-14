import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Trail } from '@react-three/drei';
import { useStore } from '../store';
import { Atom as AtomIcon, Zap } from 'lucide-react';
import * as THREE from 'three';

const Electron = ({ orbitRadius, speed, color }: { orbitRadius: number, speed: number, color: string }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed;
      ref.current.position.x = Math.cos(t) * orbitRadius;
      ref.current.position.z = Math.sin(t) * orbitRadius;
    }
  });

  return (
    <Trail width={1} length={8} color={new THREE.Color(color)} attenuation={(t) => t * t}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
    </Trail>
  );
};

const Nucleus = () => (
  <group>
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[0.2, 0, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#ef4444" />
        </mesh>
        <mesh position={[-0.2, 0.1, 0.1]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#3b82f6" />
        </mesh>
        <mesh position={[0, -0.2, -0.1]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#ef4444" />
        </mesh>
    </Float>
  </group>
);

export const AtomicModel: React.FC = () => {
  const { simConfig, updateSimConfig } = useStore();

  const orbitColor = useMemo(() => {
      // Color shifts based on energy level
      const colors = ['#22d3ee', '#a855f7', '#f472b6', '#facc15'];
      return colors[simConfig.excitedState - 1] || '#ffffff';
  }, [simConfig.excitedState]);

  return (
    <div className="w-full h-full relative bg-slate-950">
       <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center z-10">
           <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Quantum Bohr Model</h2>
           <p className="text-slate-400 text-sm">Energy Level: n = {simConfig.excitedState}</p>
       </div>

       <Canvas camera={{ position: [0, 5, 10] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={2} />
          
          <Nucleus />

          {/* Electron Shells */}
          <group rotation={[Math.PI/6, 0, 0]}>
             {/* Render rings for all levels up to current state */}
             {[1,2,3,4].map(n => (
                 <mesh key={n} rotation={[Math.PI/2, 0, 0]}>
                     <ringGeometry args={[n * 2, n * 2 + 0.02, 64]} />
                     <meshBasicMaterial color="white" transparent opacity={n === simConfig.excitedState ? 0.5 : 0.1} />
                 </mesh>
             ))}
             
             {/* The Active Electron */}
             <Electron 
                orbitRadius={simConfig.excitedState * 2} 
                speed={2 / simConfig.excitedState} 
                color={orbitColor} 
             />
          </group>

          <OrbitControls enableZoom={true} />
       </Canvas>

       <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 bg-slate-900/80 p-4 rounded-xl border border-white/10 backdrop-blur-md">
           <button 
             onClick={() => updateSimConfig({ excitedState: Math.max(1, simConfig.excitedState - 1) })}
             className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-white"
           >
              Relax (- Energy)
           </button>
           <div className="flex flex-col items-center px-4">
              <Zap className={`text-${orbitColor === '#22d3ee' ? 'cyan' : 'purple'}-400 mb-1`} />
              <span className="font-mono text-xl">n={simConfig.excitedState}</span>
           </div>
           <button 
             onClick={() => updateSimConfig({ excitedState: Math.min(4, simConfig.excitedState + 1) })}
             className="p-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]"
           >
              Excite (+ Energy)
           </button>
       </div>
    </div>
  );
};