import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Text, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store';
import { ZoomIn, ZoomOut } from 'lucide-react';

// Galaxy, Web, and SolarSystem sub-components omitted for brevity (they remain same logic but with opacity optimizations)
/* ... (Keep Galaxy, CosmicWeb, SolarSystem, SceneContent from existing code) ... */

// Re-including the SceneContent and components logic as per requirement for full file content
const Galaxy = ({ opacity = 1 }: { opacity: number }) => {
  const points = useMemo(() => {
    const numStars = 10000;
    const pos = new Float32Array(numStars * 3);
    const colors = new Float32Array(numStars * 3);
    const colorInside = new THREE.Color('#ffaa33');
    const colorOutside = new THREE.Color('#3366ff');
    for (let i = 0; i < numStars; i++) {
      const radius = Math.random() * 8 + 0.5;
      const angle = radius * 5 + (Math.floor(Math.random() * 5) / 5) * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5);
      pos[i * 3 + 1] = (Math.random() - 0.5) * (Math.exp(-radius * 0.5)) * 1.5;
      pos[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5);
      const mixedColor = colorInside.clone().lerp(colorOutside, radius / 8);
      colors[i * 3] = mixedColor.r; colors[i * 3 + 1] = mixedColor.g; colors[i * 3 + 2] = mixedColor.b;
    }
    return { pos, colors };
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={points.pos.length / 3} array={points.pos} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={points.colors.length / 3} array={points.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
};

const CosmicWeb = ({ opacity = 1 }: { opacity: number }) => {
  const meshRef = useRef<THREE.Points>(null);
  const points = useMemo(() => {
    const positions: number[] = []; const colors: number[] = [];
    for (let i = 0; i < 50; i++) {
        const p1 = new THREE.Vector3((Math.random()-0.5)*100, (Math.random()-0.5)*100, (Math.random()-0.5)*100);
        for(let j=0; j<20; j++) {
            positions.push(p1.x + (Math.random()-0.5)*5, p1.y + (Math.random()-0.5)*5, p1.z + (Math.random()-0.5)*5);
            colors.push(0.4, 0.2, 0.8);
        }
    }
    return { pos: new Float32Array(positions), col: new Float32Array(colors) };
  }, []);
  useFrame((state) => { if (meshRef.current) meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.01; });
  return (
    <points ref={meshRef}>
       <bufferGeometry>
         <bufferAttribute attach="attributes-position" count={points.pos.length/3} array={points.pos} itemSize={3} />
         <bufferAttribute attach="attributes-color" count={points.col.length/3} array={points.col} itemSize={3} />
       </bufferGeometry>
       <pointsMaterial size={0.2} vertexColors transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
};

const SolarSystem = ({ opacity }: { opacity: number }) => (
    <group>
      <mesh><sphereGeometry args={[0.5, 32, 32]} /><meshBasicMaterial color="#FDB813" transparent opacity={opacity} /></mesh>
      {[1.5, 2.5, 4.0].map((radius, i) => (
         <group key={i} rotation={[0, Math.random() * Math.PI, 0]}>
             <mesh rotation={[Math.PI/2, 0, 0]}><ringGeometry args={[radius, radius + 0.02, 64]} /><meshBasicMaterial color="#ffffff" transparent opacity={opacity * 0.2} side={THREE.DoubleSide} /></mesh>
             <mesh position={[radius, 0, 0]}><sphereGeometry args={[0.1, 16, 16]} /><meshStandardMaterial color="#4f46e5" transparent opacity={opacity} /></mesh>
         </group>
      ))}
    </group>
);

const SceneContent = () => {
  const { universeScale } = useStore();
  const solarOpacity = Math.max(0, (universeScale - 60) / 40);
  let galaxyOpacity = 0;
  if (universeScale > 10 && universeScale < 90) {
      if (universeScale < 50) galaxyOpacity = (universeScale - 10) / 40;
      else galaxyOpacity = 1 - (universeScale - 50) / 40;
  }
  const webOpacity = Math.max(0, (40 - universeScale) / 40);
  return (
    <group>
      {universeScale > 50 && (
        <group scale={[Math.pow(universeScale/100, 2), Math.pow(universeScale/100, 2), Math.pow(universeScale/100, 2)]}>
           <SolarSystem opacity={solarOpacity} />
        </group>
      )}
      <group scale={2 + (universeScale/10)} rotation={[Math.PI/3, 0, 0]} visible={galaxyOpacity > 0}>
        <Galaxy opacity={galaxyOpacity} />
      </group>
      <group scale={0.5 + (universeScale/20)} visible={webOpacity > 0}>
        <CosmicWeb opacity={webOpacity} />
      </group>
    </group>
  );
};

export const CosmosExplorer: React.FC = () => {
  const { universeScale, setUniverseScale } = useStore();
  const getScaleLabel = () => {
    if (universeScale > 70) return "Local System";
    if (universeScale > 30) return "Stellar Cluster";
    return "The Cosmic Web";
  };

  return (
    <div className="w-full h-full relative bg-black overflow-hidden touch-none">
      <Canvas camera={{ position: [0, 8, 16], fov: 45 }}>
        <color attach="background" args={['#010103']} />
        <ambientLight intensity={0.5} />
        <SceneContent />
        <OrbitControls enableZoom={true} enablePan={false} makeDefault />
        <Stars radius={200} depth={50} count={6000} factor={4} saturation={0.5} fade />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-x-0 bottom-8 lg:bottom-12 flex flex-col items-center pointer-events-none z-10 px-4">
        <div className="bg-slate-950/90 backdrop-blur-2xl border border-white/10 p-5 lg:p-7 rounded-3xl pointer-events-auto w-full max-w-xl shadow-2xl">
          <div className="flex justify-between items-end mb-6">
             <div>
                <h2 className="text-cyan-500 font-black uppercase tracking-tighter text-xs mb-1">Observation Level</h2>
                <div className="text-white font-mono text-xl lg:text-2xl font-black tracking-tight leading-none uppercase">
                    {getScaleLabel()}
                </div>
             </div>
             <div className="text-right">
                <span className="text-2xl lg:text-3xl font-mono text-cyan-400 font-black">{Math.round(universeScale)}%</span>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button onClick={() => setUniverseScale(Math.max(0, universeScale - 5))} className="p-2 text-slate-500 hover:text-white"><ZoomOut size={20} /></button>
             <div className="relative flex-1 h-12 flex items-center">
                <div className="absolute w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]" style={{ width: `${universeScale}%` }} />
                </div>
                <input 
                    type="range" min="0" max="100" step="0.1" value={universeScale} 
                    onChange={(e) => setUniverseScale(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
             </div>
             <button onClick={() => setUniverseScale(Math.min(100, universeScale + 5))} className="p-2 text-cyan-500 hover:text-white"><ZoomIn size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};