import React, {useState} from 'react';
import Menu from './components/Menu';
import GameSetup, { GameOptions } from './pages/GameSetup';
import GamePlay from './pages/GamePlay';
import ErrorPage from './pages/Error';
import Settings from './pages/Settings';
import Credits from './pages/Credits';

type Route = 'menu' | 'setup' | 'play' | 'error' | 'settings' | 'credits';

export default function App() {
  const [route, setRoute] = useState<Route>('menu');
  const [options, setOptions] = useState<GameOptions | null>(null);

  function handleStart(){
    setRoute('setup');
  }

  function handlePlay(opts:GameOptions){
    setOptions(opts);
    setRoute('play');
  }

  return (
    <div style={{minHeight: '100vh'}}>
      {route === 'menu' && (
        <Menu onStart={handleStart} onOpenSettings={()=>setRoute('settings')} onOpenCredits={()=>setRoute('credits')} onError={()=>setRoute('error')} />
      )}

      {route === 'setup' && (
        <GameSetup onPlay={handlePlay} onBack={()=>setRoute('menu')} />
      )}

      {route === 'play' && options && (
        <div className="game-enter">
          <GamePlay options={options} onBack={()=>setRoute('menu')} />
        </div>
      )}

      {route === 'settings' && (
        <Settings onBack={()=>setRoute('menu')} />
      )}

      {route === 'credits' && (
        <Credits onBack={()=>setRoute('menu')} />
      )}

      {route === 'error' && (
        <ErrorPage error={new Error('An error occurred')} info={undefined} />
      )}
    </div>
  );
}
