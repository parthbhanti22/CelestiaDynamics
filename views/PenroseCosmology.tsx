import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Text, MeshDistortMaterial, Trail, Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { Layers, Zap, Disc, MousePointer2, RefreshCw } from 'lucide-react';

// --- Parallax Background ---
const ParallaxStars = () => {
  const ref = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (ref.current) {
      // Gentle parallax movement opposite to mouse
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, mouse.y * 0.05, 0.05);
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, mouse.x * 0.05, 0.05);
    }
  });

  return (
    <group ref={ref}>
      <Stars radius={200} depth={50} count={5000} factor={4} saturation={0.8} fade />
    </group>
  );
};

// --- Interactive Bubble Component ---
const Bubble = ({ position, scale, color }: { position: [number, number, number], scale: number, color: THREE.Color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [popped, setPopped] = useState(false);
  const [popTime, setPopTime] = useState(0);

  useFrame((state, delta) => {
    if (popped) {
      if (meshRef.current) {
         // Explode/Shrink effect
         meshRef.current.scale.multiplyScalar(0.85);
         meshRef.current.rotation.x += 0.5;
         if (meshRef.current.scale.x < 0.01) meshRef.current.visible = false;
      }
      return;
    }

    if (meshRef.current) {
      // Agitate when hovered
      const distortSpeed = hovered ? 4 : 1;
      const hoverScale = hovered ? scale * 1.2 : scale;
      
      meshRef.current.scale.lerp(new THREE.Vector3(hoverScale, hoverScale, hoverScale), 0.1);
    }
  });

  const handlePop = (e: any) => {
    e.stopPropagation(); // Prevent clicking through to other bubbles immediately
    setPopped(true);
    setPopTime(Date.now());
  };

  if (popped && meshRef.current && !meshRef.current.visible) return null;

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh 
        ref={meshRef} 
        position={position} 
        onPointerOver={() => setHovered(true)} 
        onPointerOut={() => setHovered(false)}
        onClick={handlePop}
        visible={!popped || (meshRef.current && meshRef.current.scale.x > 0.01)}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial 
          color={color}
          attach="material"
          distort={hovered ? 0.6 : 0.3} 
          speed={hovered ? 4 : 1.5}
          roughness={0}
          metalness={0.8}
          transmission={0.9} // Glass-like
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Underlying pattern reveal when popped? Maybe sparkles */}
      {popped && (
         <mesh position={position}>
             <sphereGeometry args={[scale * 1.5, 8, 8]} />
             <meshBasicMaterial color="white" wireframe transparent opacity={0.2} />
         </mesh>
      )}
    </Float>
  );
};

const BubblesScene = () => {
    const bubbles = useMemo(() => {
        return new Array(40).fill(0).map(() => ({
            position: [
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 15
            ] as [number, number, number],
            scale: Math.random() * 1.5 + 0.5,
            color: new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.6) // Blues/Purples
        }))
    }, []);

    return (
        <group>
             {bubbles.map((data, i) => (
                 <Bubble key={i} {...data} />
             ))}
        </group>
    )
}

// --- Penrose Cycle / Wormhole Visualization ---
const PenroseCycleScene = () => {
  // Visualizes a Black Hole connecting to a White Hole in a parallel universe
  const tunnelPoints = useMemo(() => {
     const points = [];
     for(let i=0; i<=20; i++) {
        const t = i/20;
        // Hourglass shape
        const x = (t - 0.5) * 15;
        const radius = 2 / (Math.abs(t - 0.5) * 4 + 0.5); 
        points.push(new THREE.Vector3(x, radius, 0));
     }
     return points;
  }, []);

  return (
    <group>
       <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
           {/* Universe A (Black Hole Side) */}
           <group position={[-8, 0, 0]}>
               <Text position={[0, 4, 0]} fontSize={0.8} color="#ef4444" anchorX="center" anchorY="middle">
                  Universe A (Collapse)
               </Text>
               <mesh>
                   <sphereGeometry args={[2, 32, 32]} />
                   <meshStandardMaterial color="black" roughness={0.2} />
               </mesh>
               {/* Accretion */}
               <mesh rotation={[Math.PI/2, 0, 0]}>
                   <ringGeometry args={[2.5, 5, 32]} />
                   <meshBasicMaterial color="#ef4444" side={THREE.DoubleSide} transparent opacity={0.5} />
               </mesh>
               {/* Particles being sucked in */}
               <PointsImplosion color="#ef4444" radius={6} count={200} speed={1} />
           </group>

           {/* The Bridge (Einstein-Rosen) */}
           <group rotation={[0, 0, Math.PI/2]}>
              <mesh position={[0,0,0]}>
                  <cylinderGeometry args={[1, 1, 12, 16, 16, true]} />
                  <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.3} side={THREE.DoubleSide} />
              </mesh>
              {/* Moving Energy through tunnel */}
              <EnergyFlow />
           </group>

           {/* Universe B (White Hole Side) */}
           <group position={[8, 0, 0]}>
               <Text position={[0, 4, 0]} fontSize={0.8} color="#22d3ee" anchorX="center" anchorY="middle">
                  Universe B (Expansion)
               </Text>
               <mesh>
                   <sphereGeometry args={[2, 32, 32]} />
                   <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
               </mesh>
               {/* Shockwave */}
               <mesh rotation={[Math.PI/2, 0, 0]}>
                   <ringGeometry args={[2.5, 6, 32]} />
                   <meshBasicMaterial color="#22d3ee" side={THREE.DoubleSide} transparent opacity={0.4} />
               </mesh>
               {/* Particles being spewed out */}
               <PointsExplosion color="#22d3ee" radius={1} count={200} speed={1} />
           </group>

           {/* Penrose Pattern "Fabric" Background planes */}
           <PenroseTilingPlane position={[0, -5, 0]} rotation={[-Math.PI/2, 0, 0]} />
       </Float>
    </group>
  );
};

const EnergyFlow = () => {
    const particles = useMemo(() => new Float32Array(50 * 3), []);
    const ref = useRef<THREE.Points>(null);
    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.getElapsedTime();
        const positions = ref.current.geometry.attributes.position.array as Float32Array;
        for(let i=0; i<50; i++) {
            // Move along Y axis (which is X in world space due to rotation)
            const y = ((t * 2 + i) % 12) - 6;
            positions[i*3] = Math.sin(y * 0.5) * 0.5; // Spiral
            positions[i*3+1] = y;
            positions[i*3+2] = Math.cos(y * 0.5) * 0.5;
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
    });
    
    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={50} array={particles} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.1} color="white" />
        </points>
    )
}

const PointsImplosion = ({ color, radius, count, speed }: any) => {
    const ref = useRef<THREE.Points>(null);
    const initialPos = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for(let i=0; i<count; i++) {
            const r = Math.random() * radius + 2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            arr[i*3] = r * Math.sin(phi) * Math.cos(theta);
            arr[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
            arr[i*3+2] = r * Math.cos(phi);
        }
        return arr;
    }, [radius, count]);

    useFrame((state) => {
        if (!ref.current) return;
        const positions = ref.current.geometry.attributes.position.array as Float32Array;
        const t = state.clock.getElapsedTime() * speed;
        
        for(let i=0; i<count; i++) {
             // Animate inwards cyclically
             const offset = i * 100;
             const modT = (t * 1000 + offset) % 3000 / 3000; // 0 to 1
             // 1 -> 0
             const scale = 1 - modT;
             
             positions[i*3] = initialPos[i*3] * scale;
             positions[i*3+1] = initialPos[i*3+1] * scale;
             positions[i*3+2] = initialPos[i*3+2] * scale;
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={ref}>
             <bufferGeometry>
                 <bufferAttribute attach="attributes-position" count={count} array={new Float32Array(count*3)} itemSize={3} />
             </bufferGeometry>
             <pointsMaterial size={0.05} color={color} transparent opacity={0.6} />
        </points>
    )
}

const PointsExplosion = ({ color, radius, count, speed }: any) => {
    const ref = useRef<THREE.Points>(null);
    const dirs = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for(let i=0; i<count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            arr[i*3] = Math.sin(phi) * Math.cos(theta);
            arr[i*3+1] = Math.sin(phi) * Math.sin(theta);
            arr[i*3+2] = Math.cos(phi);
        }
        return arr;
    }, [count]);

    useFrame((state) => {
        if (!ref.current) return;
        const positions = ref.current.geometry.attributes.position.array as Float32Array;
        const t = state.clock.getElapsedTime() * speed;
        
        for(let i=0; i<count; i++) {
             const offset = i * 50;
             const modT = (t * 1000 + offset) % 3000 / 3000; // 0 to 1
             const dist = modT * 6 + 2; // Move outwards from radius 2 to 8
             
             positions[i*3] = dirs[i*3] * dist;
             positions[i*3+1] = dirs[i*3+1] * dist;
             positions[i*3+2] = dirs[i*3+2] * dist;
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={ref}>
             <bufferGeometry>
                 <bufferAttribute attach="attributes-position" count={count} array={new Float32Array(count*3)} itemSize={3} />
             </bufferGeometry>
             <pointsMaterial size={0.05} color={color} transparent opacity={0.6} />
        </points>
    )
}

// Procedural Penrose-like Tiling visuals (simplified abstract pattern)
const PenroseTilingPlane = (props: any) => {
    return (
        <group {...props}>
             <gridHelper args={[40, 20, '#333', '#111']} />
             {/* Random Geometric shards representing the tiling */}
             {Array.from({length: 30}).map((_, i) => (
                 <mesh key={i} position={[(Math.random()-0.5)*30, 0, (Math.random()-0.5)*10]} rotation={[-Math.PI/2, 0, Math.random()*Math.PI]}>
                     <circleGeometry args={[Math.random() + 0.5, 5]} />
                     <meshBasicMaterial color="#333" wireframe side={THREE.DoubleSide} transparent opacity={0.3} />
                 </mesh>
             ))}
        </group>
    )
}

export const PenroseCosmology: React.FC = () => {
  const [viewMode, setViewMode] = useState<'BUBBLES' | 'CYCLE'>('BUBBLES');

  return (
    <div className="w-full h-full relative bg-[#050505]">
        {/* Header / Info Panel */}
        <div className="absolute top-24 left-10 z-10 max-w-md pointer-events-none">
            <h1 className="text-4xl font-light text-white mb-2 tracking-tight">Conformal Cyclic Cosmology</h1>
            <h2 className="text-sm font-bold text-cosmic-magenta uppercase tracking-[0.3em] mb-4">Penrose Visualizer</h2>
            
            <p className="text-slate-400 leading-relaxed text-sm backdrop-blur-sm bg-black/30 p-4 rounded-xl border-l-2 border-white/20">
                {viewMode === 'BUBBLES' 
                  ? "Visualize the Multiverse as a 'foam' of bubble universes. Interact with them to see how instability can lead to new cosmic events. Drag to rotate, click to pop."
                  : "Explore the theoretical bridge where the heat death of one universe (Black Hole singularity) seeds the Big Bang of another (White Hole), connected via spacetime geometry."}
            </p>
        </div>

        {/* View Toggle */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-4 bg-slate-900/80 backdrop-blur-md p-2 rounded-full border border-white/10">
            <button 
                onClick={() => setViewMode('BUBBLES')}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'BUBBLES' ? 'bg-white text-black shadow-lg shadow-white/20' : 'text-slate-400 hover:text-white'}`}
            >
                <Layers size={16} /> Multiverse Foam
            </button>
            <button 
                onClick={() => setViewMode('CYCLE')}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'CYCLE' ? 'bg-cosmic-magenta text-white shadow-lg shadow-pink-500/20' : 'text-slate-400 hover:text-white'}`}
            >
                <RefreshCw size={16} /> Cosmic Cycle
            </button>
        </div>

        {/* Hints */}
        {viewMode === 'BUBBLES' && (
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 animate-[fade-in_3s_ease-in-out_2s_forwards]">
                  <div className="flex flex-col items-center gap-2 text-white/20">
                      <MousePointer2 size={32} />
                      <span className="text-xs uppercase tracking-widest">Click to Pop</span>
                  </div>
             </div>
        )}

        <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
            <color attach="background" args={['#050505']} />
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <spotLight position={[-10, -10, -10]} angle={0.3} penumbra={1} intensity={2} color="#cc00ff" />
            
            <ParallaxStars />

            {viewMode === 'BUBBLES' ? (
                <BubblesScene />
            ) : (
                <PenroseCycleScene />
            )}
            
            <OrbitControls 
                autoRotate={viewMode === 'BUBBLES'} 
                autoRotateSpeed={0.3} 
                enableZoom={true} 
                enablePan={false}
                maxDistance={50}
                minDistance={10}
            />
        </Canvas>
    </div>
  );
};