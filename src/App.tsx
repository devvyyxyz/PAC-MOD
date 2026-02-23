import React, {useState, useEffect} from 'react';
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
  const [history, setHistory] = useState<Route[]>([]);

  // navigate to a new route and push current route onto history
  function navigate(next: Route){
    setHistory(h => [...h, route]);
    setRoute(next);
  }

  // go back to previous route (pop history). falls back to 'menu'
  function goBack(){
    setHistory(h => {
      if(h.length === 0){ setRoute('menu'); return []; }
      const prev = h[h.length - 1];
      const nextHistory = h.slice(0, h.length - 1);
      setRoute(prev);
      return nextHistory;
    });
  }

  function handleStart(){ navigate('setup'); }

  function handlePlay(opts:GameOptions){
    setOptions(opts);
    navigate('play');
  }

  // global Escape handling: always go back
  useEffect(()=>{
    function onKey(e: KeyboardEvent){ if(e.key === 'Escape') { e.preventDefault(); goBack(); } }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  },[]);

  return (
    <div style={{minHeight: '100vh'}}>
      {route === 'menu' && (
        <Menu onStart={handleStart} onOpenSettings={()=>navigate('settings')} onOpenCredits={()=>navigate('credits')} onError={()=>navigate('error')} />
      )}

      {route === 'setup' && (
        <GameSetup onPlay={handlePlay} onBack={goBack} />
      )}

      {route === 'play' && options && (
        <div className="game-enter">
          <GamePlay options={options} onBack={goBack} />
        </div>
      )}

      {route === 'settings' && (
        <Settings onBack={goBack} />
      )}

      {route === 'credits' && (
        <Credits onBack={goBack} />
      )}

      {route === 'error' && (
        <ErrorPage error={new Error('An error occurred')} info={undefined} />
      )}
    </div>
  );
}
