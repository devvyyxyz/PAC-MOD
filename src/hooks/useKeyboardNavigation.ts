import { useEffect, useState, MutableRefObject } from 'react';

type Scheme = 'arrow' | 'wasd';

export function useKeyboardNavigation(opts: {
  length: number;
  controlScheme?: Scheme;
  enabled?: boolean;
  starting?: boolean;
  btnRefs?: MutableRefObject<Array<HTMLElement | null>>;
  onActivate?: (index: number) => void;
  initialIndex?: number;
}){
  const { length, controlScheme = 'arrow', enabled = true, starting = false, btnRefs, onActivate, initialIndex = 0 } = opts;
  const [focusIndex, setFocusIndex] = useState<number>(initialIndex);
  const [activeInput, setActiveInput] = useState<'auto'|'mouse'|'keyboard'>('auto');

  // Focus DOM element when index changes
  useEffect(()=>{
    if (!length || length <= 0) return;
    const el = btnRefs?.current?.[focusIndex] as HTMLElement | undefined | null;
    if(el) el.focus();
    // set data-focused attribute
    try{
      btnRefs?.current?.forEach((b, i) => {
        if(!b) return;
        if(i === focusIndex) b.setAttribute('data-focused', 'true'); else b.removeAttribute('data-focused');
      });
    }catch(e){}
  },[focusIndex, btnRefs]);

  useEffect(()=>{
    function handleKey(e: KeyboardEvent){
      if(!enabled) return;
      if(starting) return;
      if(activeInput === 'mouse') return;
      if (!length || length <= 0) return;
      const k = e.key.toLowerCase();
      const isUp = (controlScheme === 'wasd') ? (k === 'w') : (k === 'arrowup');
      const isDown = (controlScheme === 'wasd') ? (k === 's') : (k === 'arrowdown');
      if(isUp){ e.preventDefault(); setActiveInput('keyboard'); setFocusIndex(i => (i - 1 + length) % length); return; }
      if(isDown){ e.preventDefault(); setActiveInput('keyboard'); setFocusIndex(i => (i + 1) % length); return; }
      if(k === 'home'){ e.preventDefault(); setActiveInput('keyboard'); setFocusIndex(0); return; }
      if(k === 'end'){ e.preventDefault(); setActiveInput('keyboard'); setFocusIndex(length - 1); return; }
      if(k === 'enter' || k === ' '){ e.preventDefault(); setActiveInput('keyboard'); if(onActivate) onActivate(focusIndex); }
    }
    window.addEventListener('keydown', handleKey);
    return ()=> window.removeEventListener('keydown', handleKey);
  }, [enabled, starting, controlScheme, activeInput, focusIndex, length, onActivate]);

  function onMouseEnter(idx: number){
    if(!enabled) return;
    if(activeInput === 'keyboard') return;
    setActiveInput('mouse');
    setFocusIndex(idx);
  }

  return { focusIndex, setFocusIndex, activeInput, setActiveInput, onMouseEnter };
}

export default useKeyboardNavigation;
