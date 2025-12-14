export interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  content: string;
  imageUrl: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Finding Planet X-123',
    date: 'Feb 6, 2023',
    category: 'Astrophysics',
    summary: 'A deep dive into the recent anomalies detected in the Kuiper Belt suggesting a massive hidden object.',
    imageUrl: 'https://images.unsplash.com/photo-1701014159143-09482059f571?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: `
      <p class="mb-4">Astronomers have long speculated about the existence of a "Planet Nine" lurking in the far reaches of our solar system. Recent data from the James Webb Space Telescope has provided tantalizing clues about a new candidate: Planet X-123.</p>
      
      <h3 class="text-xl font-bold text-cyan-300 mb-2 mt-6">Gravitational Anomalies</h3>
      <p class="mb-4">The search began when gravitational perturbations were observed in the orbits of trans-Neptunian objects (TNOs). Mathematical models suggest a planet with a mass approximately 5 to 10 times that of Earth is shepherding these icy bodies.</p>
      
      <blockquote class="border-l-4 border-cyan-500 pl-4 italic my-6 text-slate-400">
        "The probability of this clustering happening by chance is less than 0.007%. There is something out there."
      </blockquote>

      <h3 class="text-xl font-bold text-cyan-300 mb-2 mt-6">What We Know So Far</h3>
      <ul class="list-disc pl-5 space-y-2 mb-4 text-slate-300">
        <li>Estimated Distance: 400-800 AU from the Sun.</li>
        <li>Orbital Period: 10,000 - 20,000 Earth years.</li>
        <li>Composition: Likely an icy giant similar to Neptune.</li>
      </ul>
      
      <p>As we continue to scan the dark sectors of the sky, Celestia Dynamics will update our simulation engines to include hypothetical orbital paths for X-123.</p>
    `
  },
  {
    id: '2',
    title: 'The Future of Simulation Engines',
    date: 'Oct 12, 2023',
    category: 'Dev Updates',
    summary: 'How WebGL and WebGPU are unlocking cinema-quality physics simulations directly in the browser.',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000',
    content: `
      <p class="mb-4">The barrier between "gaming quality" graphics and web applications is dissolving. With the advent of WebGPU, we are entering an era where educational tools can rival AAA video games in visual fidelity.</p>
      
      <h3 class="text-xl font-bold text-purple-300 mb-2 mt-6">Why R3F Matters</h3>
      <p class="mb-4">React Three Fiber (R3F) allows us to bridge the declarative nature of React with the imperative power of Three.js. This architecture enables us to manage complex state—like the spin of a black hole or the trajectory of a projectile—while maintaining 60 FPS.</p>

      <h3 class="text-xl font-bold text-purple-300 mb-2 mt-6">Performance Optimization</h3>
      <p class="mb-4">At Celestia Dynamics, we utilize instanced rendering for star fields and custom GLSL shaders for accretion disks. This ensures that even on mobile devices, the universe feels alive and responsive.</p>
      
      <p>Our next update will introduce real-time fluid dynamics for nebulae generation. Stay tuned.</p>
    `
  }
];