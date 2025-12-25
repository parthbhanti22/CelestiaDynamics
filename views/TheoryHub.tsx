import React from 'react';
import { TheoryCard } from '../components/TheoryCard';
import { TheoryItem } from '../types';

const theories: TheoryItem[] = [
  {
    id: 'einstein_field',
    title: 'Einstein Field Equations',
    latex: 'R_{\\mu\\nu} - \\frac{1}{2}Rg_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}',
    description: 'Relativity describes the fundamental interaction of gravitation as a result of spacetime being curved by matter and energy.',
    derivation: [
      '\\delta S = 0 \\quad \\text{(Least Action)}',
      'S = \\int (R + L_m) \\sqrt{-g} d^4x',
      'R_{\\mu\\nu} - \\frac{1}{2}Rg_{\\mu\\nu} = \\kappa T_{\\mu\\nu}'
    ]
  },
  {
    id: 'maxwell',
    title: 'Maxwell\'s Equations',
    latex: '\\begin{aligned} \\nabla \\cdot \\mathbf{E} &= \\frac{\\rho}{\\varepsilon_0} \\\\ \\nabla \\cdot \\mathbf{B} &= 0 \\\\ \\nabla \\times \\mathbf{E} &= -\\frac{\\partial \\mathbf{B}}{\\partial t} \\\\ \\nabla \\times \\mathbf{B} &= \\mu_0\\mathbf{J} + \\mu_0\\varepsilon_0\\frac{\\partial \\mathbf{E}}{\\partial t} \\end{aligned}',
    description: 'Foundation of electromagnetism and classical optics.',
    derivation: [
      '\\oint \\mathbf{E} \\cdot d\\mathbf{A} = \\frac{Q_{enc}}{\\varepsilon_0}',
      '\\oint \\mathbf{E} \\cdot d\\mathbf{l} = -\\frac{d\\Phi_B}{dt}'
    ]
  },
  {
    id: 'schrodinger',
    title: 'Schrödinger Equation',
    latex: 'i\\hbar\\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r},t) = \\hat{H}\\Psi(\\mathbf{r},t)',
    description: 'Governs the wave function of quantum systems.',
    derivation: [
      'E = \\hbar \\omega',
      'E\\Psi = i\\hbar \\frac{\\partial}{\\partial t}\\Psi'
    ]
  }
];

export const TheoryHub: React.FC = () => {
  return (
    <div className="w-full h-full overflow-y-auto px-4 pb-32 pt-6 lg:pt-10 scroll-smooth">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 lg:mb-16 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-2 tracking-tighter uppercase">
            Theory Hub
            </h1>
            <p className="text-cyan-400 text-sm lg:text-lg font-bold uppercase tracking-widest">Mathematical Architecture</p>
        </header>
        
        <div className="space-y-6 lg:space-y-8">
          {theories.map(t => <TheoryCard key={t.id} item={t} />)}
        </div>

        <footer className="mt-20 text-center text-slate-600 text-[10px] uppercase tracking-widest pb-10 italic">
             "Equations are for eternity." - A. Einstein
        </footer>
      </div>
    </div>
  );
};