import React from 'react';
import { Layout } from './components/Layout';
import { useStore } from './store';
import { ViewState } from './types';
import { Home } from './views/Home';
import { CosmosExplorer } from './views/CosmosExplorer';
import { BlackHoleSimulation } from './views/BlackHole';
import { TheoryHub } from './views/TheoryHub';
import { ProjectileMotion } from './views/ProjectileMotion';
import { AtomicModel } from './views/AtomicModel';
import { ThermalSim } from './views/ThermalSim';
import { PenroseCosmology } from './views/PenroseCosmology';
import { Blog } from './views/Blog';
import { About } from './views/About';
import { SignIn } from './views/SignIn';
import { SignUp } from './views/SignUp';
import { Maintenance } from './views/Maintenance';

const App: React.FC = () => {
  const { currentView } = useStore();

  const renderView = () => {
    switch (currentView) {
      case ViewState.HOME:
        return <Home />;
      case ViewState.COSMOS:
        return <CosmosExplorer />;
      case ViewState.SIM_BLACKHOLE:
        return <BlackHoleSimulation />;
      case ViewState.SIM_PROJECTILE:
        return <ProjectileMotion />;
      case ViewState.SIM_ATOMIC:
        return <AtomicModel />;
      case ViewState.SIM_THERMAL:
        return <ThermalSim />;
      case ViewState.SIM_PENROSE:
        return <PenroseCosmology />;
      case ViewState.THEORY:
        return <TheoryHub />;
      case ViewState.BLOG:
        return <Blog />;
      case ViewState.ABOUT:
        return <About />;
      case ViewState.SIGN_IN:
        return <SignIn />;
      case ViewState.SIGN_UP:
        return <SignUp />;
      case ViewState.MAINTENANCE:
        return <Maintenance />;
      default:
        return <Home />;
    }
  };

  return (
    <Layout>
      {renderView()}
    </Layout>
  );
};

export default App;