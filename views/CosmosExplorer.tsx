import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Text, Sparkles, Cloud } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store';
import { Info, ZoomIn, ZoomOut } from 'lucide-react';

// Augment JSX
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

/**
 * Procedural spiral galaxy generator
 */
const Galaxy = ({ opacity = 1 }: { opacity: number }) => {
  const points = useMemo(() => {
    const numStars = 15000;
    const pos = new Float32Array(numStars * 3);
    const colors = new Float32Array(numStars * 3);
    const colorInside = new THREE.Color('#ffaa33');
    const colorOutside = new THREE.Color('#3366ff');

    for (let i = 0; i < numStars; i++) {
      // Spiral Arms
      const arms = 5;
      const spinFactor = 5;
      const randomOffset = Math.random();
      const radius = Math.random() * 8 + 0.5;
      const spinAngle = radius * spinFactor;
      const branchAngle = (Math.floor(Math.random() * arms) / arms) * Math.PI * 2;
      
      const angle = branchAngle + (Math.log(radius) * 0.2) - (radius * 0.1); 
      // Add randomness to spread stars out of perfect lines
      const randomAngle = angle + (Math.random() - 0.5) * 0.5;
      
      const x = Math.cos(randomAngle) * radius;
      const z = Math.sin(randomAngle) * radius;
      
      // Bulge in center, flatter at edges
      const y = (Math.random() - 0.5) * (Math.exp(-radius * 0.5)) * 2;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Color Mixing
      const mixedColor = colorInside.clone().lerp(colorOutside, radius / 8);
      // Add variation
      mixedColor.r += (Math.random() - 0.5) * 0.1;
      mixedColor.b += (Math.random() - 0.5) * 0.1;
      
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }
    return { pos, colors };
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={points.pos.length / 3} array={points.pos} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={points.colors.length / 3} array={points.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        vertexColors 
        transparent 
        opacity={opacity} 
        sizeAttenuation={true} 
        depthWrite={false} 
        blending={THREE.AdditiveBlending} 
      />
    </points>
  );
};

/**
 * Procedural Cosmic Web (Filament structure)
 * Refined to show nodes and connecting filaments
 */
const CosmicWeb = ({ opacity = 1 }: { opacity: number }) => {
  const meshRef = useRef<THREE.Points>(null);

  const points = useMemo(() => {
    // 1. Generate Nodes (Galaxy Clusters)
    const nodeCount = 80;
    const nodes: THREE.Vector3[] = [];
    const range = 90;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new THREE.Vector3(
        (Math.random() - 0.5) * range * 2,
        (Math.random() - 0.5) * range * 2,
        (Math.random() - 0.5) * range * 2
      ));
    }

    const positions: number[] = [];
    const colors: number[] = [];
    
    // Cosmic Palette
    const color1 = new THREE.Color('#5b21b6'); // Deep Violet
    const color2 = new THREE.Color('#06b6d4'); // Cyan
    const color3 = new THREE.Color('#e2e8f0'); // Starlight White

    // 2. Create Filaments connecting nearby nodes
    nodes.forEach((node, i) => {
      // Connect to nearby neighbors
      nodes.forEach((target, j) => {
        if (i >= j) return; // Avoid double connections
        
        const dist = node.distanceTo(target);
        if (dist < 40) { // Filament connection threshold
          const steps = Math.floor(dist * 6); // Particle density
          
          // Bezier curve control point (offset from center) to create organic curves
          const midPoint = new THREE.Vector3().addVectors(node, target).multiplyScalar(0.5);
          const offset = new THREE.Vector3(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
          );
          midPoint.add(offset);

          for (let k = 0; k <= steps; k++) {
            const t = k / steps;
            
            // Quadratic Bezier interpolation
            const p = new THREE.Vector3().lerpVectors(node, midPoint, t);
            const q = new THREE.Vector3().lerpVectors(midPoint, target, t);
            const pos = new THREE.Vector3().lerpVectors(p, q, t);
            
            // Add "fuzziness" (scatter) to the filament
            const scatter = 0.8 + Math.random();
            pos.x += (Math.random() - 0.5) * scatter;
            pos.y += (Math.random() - 0.5) * scatter;
            pos.z += (Math.random() - 0.5) * scatter;

            positions.push(pos.x, pos.y, pos.z);

            // Gradient color based on randomness
            const c = new THREE.Color().lerpColors(color1, color2, Math.random());
            if (Math.random() > 0.95) c.set(color3); // Occasional bright stars
            
            colors.push(c.r, c.g, c.b);
          }
        }
      });

      // 3. Add Dense Cluster at the Node itself
      const clusterSize = Math.floor(Math.random() * 40) + 10;
      for (let k = 0; k < clusterSize; k++) {
        const r = Math.random() * 4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions.push(
          node.x + r * Math.sin(phi) * Math.cos(theta),
          node.y + r * Math.sin(phi) * Math.sin(theta),
          node.z + r * Math.cos(phi)
        );
        
        const c = new THREE.Color().lerpColors(color2, color3, Math.random());
        colors.push(c.r, c.g, c.b);
      }
    });

    return { 
        pos: new Float32Array(positions), 
        col: new Float32Array(colors) 
    };
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      // Slow, majestic rotation of the universe
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.015;
      // Subtle floating
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.5;
    }
  });

  return (
    <points ref={meshRef}>
       <bufferGeometry>
         <bufferAttribute attach="attributes-position" count={points.pos.length/3} array={points.pos} itemSize={3} />
         <bufferAttribute attach="attributes-color" count={points.col.length/3} array={points.col} itemSize={3} />
       </bufferGeometry>
       <pointsMaterial 
         size={0.2} 
         vertexColors 
         transparent 
         opacity={opacity * 0.8} 
         sizeAttenuation={true} 
         blending={THREE.AdditiveBlending} 
         depthWrite={false} 
       />
    </points>
  )
}

const SolarSystem = ({ opacity }: { opacity: number }) => {
  return (
    <group>
      {/* Sun */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#FDB813" transparent opacity={opacity} />
      </mesh>
      <pointLight distance={10} intensity={2 * opacity} color="#FDB813" />

      {/* Orbits & Planets */}
      {[1.5, 2.5, 3.5, 5.0, 7.0].map((radius, i) => (
         <group key={i} rotation={[0, Math.random() * Math.PI, 0]}>
             {/* Orbit Line */}
             <mesh rotation={[Math.PI/2, 0, 0]}>
                 <ringGeometry args={[radius, radius + 0.02, 64]} />
                 <meshBasicMaterial color="#ffffff" transparent opacity={opacity * 0.15} side={THREE.DoubleSide} />
             </mesh>
             {/* Planet */}
             <mesh position={[radius, 0, 0]}>
                <sphereGeometry args={[0.1 + (i*0.02), 16, 16]} />
                <meshStandardMaterial 
                  color={['#a1a1a1', '#d4a373', '#4f46e5', '#ef4444', '#eab308'][i]} 
                  transparent opacity={opacity} 
                />
             </mesh>
         </group>
      ))}
    </group>
  )
}

const SceneContent = () => {
  const { universeScale } = useStore();
  // universeScale: 0 (Far/Web) -> 100 (Close/Solar)
  
  // Logic: 
  // 100 - 70: Solar System View (Fade out as we go < 70)
  // 80 - 20: Galaxy View
  // 30 - 0: Cosmic Web View
  
  // Normalize factors
  // Solar: Visible when scale > 60. Opacity 1 at 100, 0 at 60.
  const solarOpacity = Math.max(0, (universeScale - 60) / 40);
  
  // Galaxy: Visible when scale < 80 and > 10. 
  // Peak visibility around 50.
  // Opacity: 
  // Fade in from web (10 to 40)
  // Fade out to solar (60 to 90)
  let galaxyOpacity = 0;
  if (universeScale > 10 && universeScale < 90) {
      if (universeScale < 50) galaxyOpacity = (universeScale - 10) / 40;
      else galaxyOpacity = 1 - (universeScale - 50) / 40;
  }
  
  // Web: Visible when scale < 40.
  const webOpacity = Math.max(0, (40 - universeScale) / 40);

  // Scaling Effects
  // When zooming in (scale increasing), the larger objects (Web/Galaxy) should expand out of view, 
  // and smaller objects (Solar) should expand into view from 0.
  
  return (
    <group>
      {/* Solar System Layer */}
      {universeScale > 50 && (
        <group scale={[Math.pow(universeScale/100, 2), Math.pow(universeScale/100, 2), Math.pow(universeScale/100, 2)]}>
           <SolarSystem opacity={solarOpacity} />
        </group>
      )}

      {/* Galaxy Layer */}
      <group 
        scale={2 + (universeScale/10)} 
        rotation={[Math.PI/3, 0, 0]}
        visible={galaxyOpacity > 0}
      >
        <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.1}>
           <Galaxy opacity={galaxyOpacity} />
        </Float>
      </group>

      {/* Cosmic Web Layer */}
      <group 
        scale={0.5 + (universeScale/20)}
        visible={webOpacity > 0}
      >
        <CosmicWeb opacity={webOpacity} />
      </group>
    </group>
  );
};

export const CosmosExplorer: React.FC = () => {
  const { universeScale, setUniverseScale } = useStore();
  
  // Text Label Logic
  const getScaleLabel = () => {
    if (universeScale > 70) return "Solar System (1 AU)";
    if (universeScale > 30) return "Milky Way Galaxy (100k LY)";
    return "Cosmic Web (500M LY)";
  };

  return (
    <div className="w-full h-full relative bg-black">
      <Canvas camera={{ position: [0, 8, 16], fov: 45 }}>
        <color attach="background" args={['#020204']} />
        <fog attach="fog" args={['#020204', 10, 60]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#ffaa00" />
        
        <SceneContent />
        
        <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            maxPolarAngle={Math.PI/1.5} 
            autoRotate={universeScale > 20 && universeScale < 80}
            autoRotateSpeed={0.5}
        />
        <Stars radius={200} depth={50} count={8000} factor={4} saturation={0.8} fade />
        <Sparkles count={500} scale={20} size={2} speed={0.4} opacity={0.5} color="#44aaff" />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-x-0 bottom-10 flex flex-col items-center pointer-events-none z-10">
        <div className="bg-slate-950/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl pointer-events-auto w-11/12 max-w-xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <div className="flex justify-between items-center mb-6">
             <div>
                <h2 className="text-cyan-400 font-bold uppercase tracking-[0.2em] text-xs mb-1">Cosmic Scale</h2>
                <div className="flex items-center gap-2 text-white font-mono text-xl tracking-tight">
                    {getScaleLabel()}
                </div>
             </div>
             <div className="text-right text-xs text-slate-500">
                <span className="block mb-1">Zoom Power</span>
                <span className="text-2xl font-mono text-cyan-200">{Math.round(universeScale)}<span className="text-sm text-slate-600">%</span></span>
             </div>
          </div>
          
          {/* Slider Container */}
          <div className="flex items-center gap-4">
             <ZoomOut size={16} className="text-slate-500" />
             <div className="relative flex-1 h-10 flex items-center">
                {/* Track */}
                <div className="absolute w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                       className="h-full bg-gradient-to-r from-indigo-900 via-purple-600 to-cyan-400" 
                       style={{ width: `${universeScale}%` }} 
                    />
                </div>
                {/* Input */}
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="0.5"
                    value={universeScale} 
                    onChange={(e) => setUniverseScale(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {/* Thumb Visual (Simulated) */}
                <div 
                    className="absolute top-1/2 w-6 h-6 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] border-2 border-slate-900 pointer-events-none transition-all duration-75"
                    style={{ left: `calc(${universeScale}% - 12px)`, transform: 'translateY(-50%)' }}
                />
             </div>
             <ZoomIn size={16} className="text-cyan-400" />
          </div>

          <div className="flex justify-between text-[9px] text-slate-600 uppercase tracking-widest font-bold mt-2 px-1">
             <span><span className="hidden sm:inline">Scale: </span>1 Gpc</span>
             <span>100 kpc</span>
             <span>1 AU</span>
          </div>
        </div>
      </div>
      
      {/* Decorative HUD Elements */}
      <div className="absolute top-24 right-8 pointer-events-none opacity-50 hidden md:block">
          <div className="border-l border-cyan-500/30 pl-4 py-2">
              <div className="text-[10px] text-cyan-500 uppercase tracking-widest mb-1">Coordinates</div>
              <div className="font-mono text-xs text-slate-400">
                  X: {(Math.random()*100).toFixed(2)}<br/>
                  Y: {(Math.random()*100).toFixed(2)}<br/>
                  Z: {(Math.random()*100).toFixed(2)}
              </div>
          </div>
      </div>
    </div>
  );
};