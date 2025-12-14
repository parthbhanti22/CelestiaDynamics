import React from 'react';
import { TheoryCard } from '../components/TheoryCard';
import { TheoryItem } from '../types';

const theories: TheoryItem[] = [
  {
    id: 'einstein_field',
    title: 'Einstein Field Equations',
    latex: 'R_{\\mu\\nu} - \\frac{1}{2}Rg_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}',
    description: 'The set of 10 equations in Einstein\'s general theory of relativity that describe the fundamental interaction of gravitation as a result of spacetime being curved by matter and energy.',
    derivation: [
      '\\delta S = 0 \\quad \\text{(Principle of Least Action)}',
      'S = \\int (R + L_m) \\sqrt{-g} d^4x',
      '\\frac{\\delta S}{\\delta g^{\\mu\\nu}} = 0',
      'R_{\\mu\\nu} - \\frac{1}{2}Rg_{\\mu\\nu} = \\kappa T_{\\mu\\nu}'
    ]
  },
  {
    id: 'maxwell',
    title: 'Maxwell\'s Equations',
    latex: '\\begin{aligned} \\nabla \\cdot \\mathbf{E} &= \\frac{\\rho}{\\varepsilon_0} \\\\ \\nabla \\cdot \\mathbf{B} &= 0 \\\\ \\nabla \\times \\mathbf{E} &= -\\frac{\\partial \\mathbf{B}}{\\partial t} \\\\ \\nabla \\times \\mathbf{B} &= \\mu_0\\mathbf{J} + \\mu_0\\varepsilon_0\\frac{\\partial \\mathbf{E}}{\\partial t} \\end{aligned}',
    description: 'A set of coupled partial differential equations that form the foundation of classical electromagnetism, classical optics, and electric circuits.',
    derivation: [
      '\\text{Gauss Law: } \\oint \\mathbf{E} \\cdot d\\mathbf{A} = \\frac{Q_{enc}}{\\varepsilon_0}',
      '\\text{Gauss Law (Mag): } \\oint \\mathbf{B} \\cdot d\\mathbf{A} = 0',
      '\\text{Faraday: } \\oint \\mathbf{E} \\cdot d\\mathbf{l} = -\\frac{d\\Phi_B}{dt}',
      '\\text{Ampere-Maxwell: } \\oint \\mathbf{B} \\cdot d\\mathbf{l} = \\mu_0 I_{enc} + \\mu_0\\varepsilon_0 \\frac{d\\Phi_E}{dt}'
    ]
  },
  {
    id: 'schrodinger',
    title: 'Time-Dependent Schrödinger Equation',
    latex: 'i\\hbar\\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r},t) = \\hat{H}\\Psi(\\mathbf{r},t)',
    description: 'A linear partial differential equation that governs the wave function of a quantum-mechanical system.',
    derivation: [
      'E = \\hbar \\omega',
      'p = \\hbar k',
      '\\Psi = e^{i(kx - \\omega t)}',
      '\\frac{\\partial}{\\partial t}\\Psi = -i\\omega \\Psi \\rightarrow E\\Psi = i\\hbar \\frac{\\partial}{\\partial t}\\Psi'
    ]
  },
  {
    id: 'wave_equation',
    title: 'Standard Wave Equation',
    latex: '\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\nabla^2 u',
    description: 'A fundamental second-order partial differential equation that describes the propagation of waves (sound, light, water) through a medium.',
    derivation: [
      '\\text{Newton\'s 2nd Law on string segment: } F_{net} = \\Delta m \\cdot a',
      'T\\sin(\\theta_{x+\\Delta x}) - T\\sin(\\theta_x) = (\\mu \\Delta x) \\frac{\\partial^2 y}{\\partial t^2}',
      '\\text{Small angle approx: } \\sin \\theta \\approx \\tan \\theta = \\frac{\\partial y}{\\partial x}',
      'T \\frac{\\partial^2 y}{\\partial x^2} = \\mu \\frac{\\partial^2 y}{\\partial t^2} \\implies v = \\sqrt{\\frac{T}{\\mu}}'
    ]
  },
  {
    id: 'doppler',
    title: 'Doppler Effect',
    latex: 'f = \\left( \\frac{c \\pm v_r}{c \\pm v_s} \\right) f_0',
    description: 'The change in frequency or wavelength of a wave in relation to an observer who is moving relative to the wave source.',
    derivation: [
      '\\text{Source moving towards observer: } \\lambda\' = \\lambda - v_s T',
      '\\text{Wave speed relative to observer: } v\' = c \\pm v_r',
      'f\' = \\frac{v\'}{\\lambda\'} = \\frac{c \\pm v_r}{\\lambda \\mp v_s T}',
      '\\text{Sub } T = 1/f_0, \\lambda = c/f_0: \\quad f\' = f_0 \\left(\\frac{c \\pm v_r}{c \\mp v_s}\\right)'
    ]
  },
  {
    id: 'heisenberg',
    title: 'Heisenberg Uncertainty Principle',
    latex: '\\sigma_x \\sigma_p \\ge \\frac{\\hbar}{2}',
    description: 'A fundamental limit to the precision with which certain pairs of physical properties of a particle, known as complementary variables (like position and momentum), can be known.',
    derivation: [
      '[\\hat{x}, \\hat{p}] = i\\hbar',
      '\\sigma_A^2 \\sigma_B^2 \\ge |\\frac{1}{2i}\\langle[\\hat{A}, \\hat{B}]\\rangle|^2',
      '\\text{Substitute } \\hat{A}=\\hat{x}, \\hat{B}=\\hat{p}',
      '\\sigma_x \\sigma_p \\ge \\frac{\\hbar}{2}'
    ]
  },
  {
    id: 'schwarzschild',
    title: 'Schwarzschild Radius',
    latex: 'R_s = \\frac{2GM}{c^2}',
    description: 'The radius of a sphere such that, if all the mass of an object were to be compressed within that sphere, the escape velocity from the surface of the sphere would equal the speed of light.',
    derivation: [
      '\\frac{1}{2}mv^2 = \\frac{GMm}{R}',
      'v = \\sqrt{\\frac{2GM}{R}}',
      'c = \\sqrt{\\frac{2GM}{R_s}}',
      'R_s = \\frac{2GM}{c^2}'
    ]
  },
  {
    id: 'friedmann',
    title: 'Friedmann Equations',
    latex: '\\frac{\\dot{a}^2 + kc^2}{a^2} = \\frac{8 \\pi G \\rho + \\Lambda c^2}{3}',
    description: 'These equations govern the expansion of space in homogeneous and isotropic models of the universe within the context of general relativity.',
    derivation: [
      '\\text{Metric: } ds^2 = -c^2dt^2 + a(t)^2 d\\Sigma^2',
      '\\text{Insert into Einstein Field Equations}',
      'G_{00} = \\frac{3}{c^2}(\\frac{\\dot{a}^2}{a^2} + \\frac{kc^2}{a^2})',
      '\\text{Solve for } \\dot{a}'
    ]
  },
  {
    id: 'dirac',
    title: 'Dirac Equation',
    latex: '(i\\gamma^\\mu\\partial_\\mu - m)\\psi = 0',
    description: 'A relativistic quantum mechanical wave equation formulated by British physicist Paul Dirac in 1928.',
    derivation: [
      'E^2 = p^2 + m^2',
      '(\\partial^2 + m^2)\\psi = 0',
      '\\text{Factorize: } (i\\gamma^\\mu\\partial_\\mu + m)(i\\gamma^\\mu\\partial_\\mu - m)\\psi = 0'
    ]
  }
];

export const TheoryHub: React.FC = () => {
  return (
    <div className="w-full h-full overflow-y-auto px-4 pb-24 scroll-smooth">
      <div className="max-w-5xl mx-auto pt-10">
        <header className="mb-12 text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 mb-4 tracking-tight">
            Theory Hub
            </h1>
            <p className="text-cyan-400 text-xl font-light">The Mathematical Architecture of Reality</p>
        </header>
        
        <div className="grid grid-cols-1 gap-8">
          {theories.map(t => <TheoryCard key={t.id} item={t} />)}
        </div>

        <footer className="mt-20 text-center text-slate-600 text-sm pb-10">
             <p>"Equations are more important to me, because politics is for the present, but an equation is for eternity." - A. Einstein</p>
        </footer>
      </div>
    </div>
  );
};