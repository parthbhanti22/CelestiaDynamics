import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { Github, Linkedin, Mail, Cpu } from 'lucide-react';
import * as THREE from 'three';

const WireframePlanet = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <group>
        <mesh ref={meshRef}>
            <icosahedronGeometry args={[2.5, 2]} />
            <meshStandardMaterial 
                color="#ffffff" 
                wireframe 
                transparent
                opacity={0.15}
            />
        </mesh>
        <Sphere args={[2.0, 32, 32]}>
            <MeshDistortMaterial 
                color="#6D0038" 
                speed={2} 
                distort={0.4} 
                transparent 
                opacity={0.4} 
            />
        </Sphere>
    </group>
  );
};

export const About: React.FC = () => {
  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="min-h-full flex flex-col">
        
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row h-[60vh]">
            <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-black/40 backdrop-blur-sm">
                 <h1 className="font-display text-6xl font-black text-white mb-4 tracking-widest">
                   ABOUT
                 </h1>
                 <h2 className="text-2xl font-light text-cyan-400 tracking-[0.4em] uppercase mb-8">
                   Celestia
                 </h2>
                 <p className="text-slate-300 leading-relaxed text-lg max-w-xl">
                    We believe that mathematics and physics shouldn't just be read from a textbook—they should be experienced. Celestia Dynamics combines cutting-edge WebGL graphics with rigorous scientific accuracy to create a digital playground for the mind.
                 </p>
            </div>
            
            <div className="w-full md:w-1/2 relative">
                <Canvas camera={{ position: [0, 0, 6] }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} color="#fff" intensity={2} />
                    <WireframePlanet />
                    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                </Canvas>
            </div>
        </div>

        {/* Mission Banner - Deep Magenta */}
        <div className="w-full bg-cosmic-magenta py-16 px-6 shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
             <div className="max-w-4xl mx-auto text-center relative z-10">
                 <h3 className="text-white font-bold text-sm tracking-[0.5em] uppercase mb-6 opacity-80">Our Mission</h3>
                 <p className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">
                    "Our mission is to revolutionize physics learning through interactive, visually stunning simulations that inspire curiosity and innovation."
                 </p>
             </div>
        </div>

        {/* Developer Section */}
        <div className="w-full bg-black py-20 px-6">
             <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
                 <div className="w-40 h-40 rounded-full border-4 border-white/10 p-2">
                     <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden relative group">
                        <Cpu className="text-white w-16 h-16 group-hover:scale-110 transition-transform" />
                     </div>
                 </div>
                 
                 <div className="text-center md:text-left">
                     <h3 className="text-4xl font-display font-bold text-white mb-2">Parth Bhanti</h3>
                     <p className="text-cosmic-magenta font-bold text-lg uppercase tracking-widest mb-6">Student & Developer</p>
                     <p className="text-slate-400 mb-8 max-w-lg">
                         Building the next generation of educational tools using the power of the web. Passionate about astrophysics, React, and 3D graphics.
                     </p>
                     
                     <div className="flex gap-6 justify-center md:justify-start">
                         <a href="https://github.com/parthbhanti22" target="_blank" rel="noreferrer" className="bg-white text-black p-3 hover:bg-cyan-400 transition-colors">
                             <Github size={20} />
                         </a>
                         <a href="https://www.linkedin.com/in/parthbhanti" className="bg-white text-black p-3 hover:bg-blue-600 hover:text-white transition-colors">
                             <Linkedin size={20} />
                         </a>
                         <a href="parthbhanti22@gmail.com" className="bg-white text-black p-3 hover:bg-red-500 hover:text-white transition-colors">
                             <Mail size={20} />
                         </a>
                     </div>
                 </div>
             </div>
        </div>

      </div>
    </div>
  );
};