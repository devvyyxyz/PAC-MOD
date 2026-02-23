import { useEffect, useState, MutableRefObject, useRef } from 'react';

type Scheme = 'arrow' | 'wasd';

export function useKeyboardNavigation(opts: {
  length: number;
  controlScheme?: Scheme;
  axis?: 'vertical' | 'horizontal';
  enabled?: boolean;
  starting?: boolean;
  btnRefs?: MutableRefObject<Array<HTMLElement | null>>;
  containerRef?: MutableRefObject<HTMLElement | null>;
  onActivate?: (index: number) => void;
  initialIndex?: number;
}){
  const { length, controlScheme = 'arrow', axis = 'vertical', enabled = true, starting = false, btnRefs, containerRef, onActivate, initialIndex = 0 } = opts;
  const [focusIndex, setFocusIndex] = useState<number>(initialIndex);
  const [activeInput, setActiveInput] = useState<'auto'|'mouse'|'keyboard'>('auto');
  const timeoutRef = useRef<number | null>(null);

  function clearInactivityTimer(){
    try{ if(timeoutRef.current){ window.clearTimeout(timeoutRef.current); timeoutRef.current = null; } }catch(e){}
  }

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
      // if a containerRef is provided, only handle keys when the focused element is inside it
      try{
        if(containerRef && containerRef.current){
          const active = document.activeElement as HTMLElement | null;
          if(active && !containerRef.current.contains(active)) return;
        }
      }catch(e){}
      if(starting) return;
      if (!length || length <= 0) return;
      const k = e.key.toLowerCase();
      let isPrev = false;
      let isNext = false;
      if(axis === 'vertical'){
        isPrev = (controlScheme === 'wasd') ? (k === 'w') : (k === 'arrowup');
        isNext = (controlScheme === 'wasd') ? (k === 's') : (k === 'arrowdown');
      }else{
        isPrev = (controlScheme === 'wasd') ? (k === 'a') : (k === 'arrowleft');
        isNext = (controlScheme === 'wasd') ? (k === 'd') : (k === 'arrowright');
      }

      if(isPrev){
        e.preventDefault();
        setActiveInput('keyboard');
        clearInactivityTimer();
        timeoutRef.current = window.setTimeout(()=>{ setActiveInput('mouse'); timeoutRef.current = null; }, 4000);
        setFocusIndex(i => (i - 1 + length) % length); return;
      }
      if(isNext){
        e.preventDefault();
        setActiveInput('keyboard');
        clearInactivityTimer();
        timeoutRef.current = window.setTimeout(()=>{ setActiveInput('mouse'); timeoutRef.current = null; }, 4000);
        setFocusIndex(i => (i + 1) % length); return;
      }
      if(k === 'home'){ e.preventDefault(); setActiveInput('keyboard'); setFocusIndex(0); return; }
      if(k === 'end'){ e.preventDefault(); setActiveInput('keyboard'); setFocusIndex(length - 1); return; }
      if(k === 'enter' || k === ' '){ e.preventDefault(); setActiveInput('keyboard'); clearInactivityTimer(); timeoutRef.current = window.setTimeout(()=>{ setActiveInput('mouse'); timeoutRef.current = null; }, 4000); if(onActivate) onActivate(focusIndex); }
    }
    window.addEventListener('keydown', handleKey);
    return ()=> { window.removeEventListener('keydown', handleKey); clearInactivityTimer(); };
  }, [enabled, starting, controlScheme, activeInput, focusIndex, length, onActivate]);

  function onMouseEnter(idx: number){
    if(!enabled) return;
    setActiveInput('mouse');
    setFocusIndex(idx);
  }

  // when the user moves the pointer, immediately switch to mouse input and clear any inactivity timer
  useEffect(()=>{
    if(typeof window === 'undefined') return;
    function onPointerMove(){
      if(!enabled) return;
      clearInactivityTimer();
      setActiveInput('mouse');
    }
    window.addEventListener('pointermove', onPointerMove);
    return ()=>{ window.removeEventListener('pointermove', onPointerMove); };
  }, [enabled]);

  return { focusIndex, setFocusIndex, activeInput, setActiveInput, onMouseEnter };
}

export default useKeyboardNavigation;
