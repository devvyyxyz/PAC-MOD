import React from 'react';
import styles from './Menu.module.css';
import { useI18n, Layout } from '../../components';
import config from '../../config';
import AUDIO from '../../config/audio';
import Title from '../Title';
import { playChomp } from '../../utils/audio';
import Button from '../Button';

type Props = { onStart?: () => void, onOpenSettings?: ()=>void, onOpenCredits?: ()=>void, onError?: ()=>void };

export default function Menu({onStart, onOpenSettings, onOpenCredits, onError}: Props) {
  const [starting, setStarting] = React.useState(false);
  const [keyboardEnabled, setKeyboardEnabled] = React.useState(true);
  const [mouseEnabled, setMouseEnabled] = React.useState(true);
  const [focusIndex, setFocusIndex] = React.useState(0);
  const [controlScheme, setControlScheme] = React.useState<'arrow'|'wasd'>('arrow');
  const { t } = useI18n();
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const btnRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  React.useEffect(()=>{
    try{
      const cfg = config.loadConfig();
      const enabled = cfg.settings?.music !== false;
      const vol = (typeof cfg.settings?.volume === 'number') ? (cfg.settings.volume / 100) : 0.7;
      setKeyboardEnabled(cfg.settings?.keyboardNavigation !== false);
      setMouseEnabled(cfg.settings?.mouseNavigation !== false);
      setControlScheme((cfg.settings?.controlScheme as 'arrow'|'wasd') || 'arrow');
      const audioEntry = AUDIO.menuAmbience;
      const src = encodeURI(audioEntry?.src || '/assets/audio/GameSFX/Ambience/Retro Ambience Short 09.wav');
      const a = new Audio(src);
      a.loop = true;
      a.volume = typeof audioEntry?.defaultVolume === 'number' ? (audioEntry.defaultVolume * vol) : vol;
      audioRef.current = a;
      if(enabled){
        a.play().catch(()=>{});
      }
    }catch(e){ /* ignore */ }

    function handleCfgChange(e: Event){
      try{
        // detail contains merged config
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const detail = (e as CustomEvent).detail as any;
        const enabled = detail?.settings?.music !== false;
        const vol = (typeof detail?.settings?.volume === 'number') ? (detail.settings.volume / 100) : 0.7;
        setKeyboardEnabled(detail?.settings?.keyboardNavigation !== false);
        setMouseEnabled(detail?.settings?.mouseNavigation !== false);
        setControlScheme((detail?.settings?.controlScheme as 'arrow'|'wasd') || 'arrow');
        if(!audioRef.current){
          const a = new Audio(encodeURI('/assets/audio/GameSFX/Ambience/Retro Ambience Short 09.wav'));
          a.loop = true;
          audioRef.current = a;
        }
        if(audioRef.current){
          audioRef.current.volume = vol;
          if(enabled){ audioRef.current.play().catch(()=>{}); } else { audioRef.current.pause(); }
        }
      }catch(err){ }
    }

    window.addEventListener('pacman.config.changed', handleCfgChange as EventListener);
    return () => {
      try{ window.removeEventListener('pacman.config.changed', handleCfgChange as EventListener); if(audioRef.current){ audioRef.current.pause(); audioRef.current.src = ''; audioRef.current = null; } }catch(e){}
    };
  },[]);

  React.useEffect(()=>{
    // ensure the focused button receives DOM focus when focusIndex changes
    const el = btnRefs.current[focusIndex];
    if(el) el.focus();
  },[focusIndex]);

  React.useEffect(()=>{
    // mark the focused button with a data attribute so CSS can reflect keyboard-only focus
    btnRefs.current.forEach((b, i) => {
      try{ if(b) { if(i === focusIndex) { b.setAttribute('data-focused', 'true'); } else { b.removeAttribute('data-focused'); } } }catch(_){}
    });
  }, [focusIndex]);

  React.useEffect(()=>{
    function handleKey(e: KeyboardEvent){
      if(!keyboardEnabled) return;
      if(starting) return;
      const len = 3;
      const k = e.key.toLowerCase();
      // navigation keys depend on controlScheme
      const isUp = (controlScheme === 'wasd') ? (k === 'w') : (k === 'arrowup');
      const isDown = (controlScheme === 'wasd') ? (k === 's') : (k === 'arrowdown');
      if(isUp){
        e.preventDefault();
        setFocusIndex((i)=> (i - 1 + len) % len);
        return;
      }
      if(isDown){
        e.preventDefault();
        setFocusIndex((i)=> (i + 1) % len);
        return;
      }
      if(k === 'home'){
        e.preventDefault();
        setFocusIndex(0);
        return;
      }
      if(k === 'end'){
        e.preventDefault();
        setFocusIndex(len - 1);
        return;
      }
      if(k === 'enter' || k === ' '){
        e.preventDefault();
        // activate current
        if(focusIndex === 0) handleStart();
        if(focusIndex === 1) handleSettings();
        if(focusIndex === 2) handleCredits();
      }
    }
    window.addEventListener('keydown', handleKey);
    return ()=> window.removeEventListener('keydown', handleKey);
  },[keyboardEnabled, starting, focusIndex, controlScheme]);

  function handleStart() {
    if (starting) return;
    playChomp();
    setStarting(true);
    setTimeout(() => { if (onStart) onStart(); }, 600);
  }

  function handleSettings(){ playChomp(); if(onOpenSettings) onOpenSettings(); }
  function handleCredits(){ playChomp(); if(onOpenCredits) onOpenCredits(); }
  function handleError(){ if(onError) onError(); }

  return (
    <div className={`${styles.wrap} ${starting ? styles.starting : ''}`}>
      <div className={styles.bg} aria-hidden />
      <Layout stageClassName={styles.stage}>
            <div className={styles.title}>
              <Title title={"PAC-MOD"} subtitle={t('menu_subtitle')} className={styles.title} />
            </div>

        <div className={styles.controls} role="navigation" aria-label="Main menu">
          <Button
            variant="primary"
            className={styles.menuButton}
            onClick={handleStart}
            autoFocus
            aria-disabled={starting}
            ref={(el: HTMLButtonElement|null) => { btnRefs.current[0] = el; }}
            onMouseEnter={() => { if(mouseEnabled) setFocusIndex(0); }}
          >{starting ? t('starting') : t('start_game')}</Button>

          <div className={styles.row}>
            <Button
              variant="secondary"
              className={styles.menuButton}
              onClick={handleSettings}
              ref={(el: HTMLButtonElement|null) => { btnRefs.current[1] = el; }}
              onMouseEnter={() => { if(mouseEnabled) setFocusIndex(1); }}
            >{t('menu_settings')}</Button>
            <Button
              variant="secondary"
              className={styles.menuButton}
              onClick={handleCredits}
              ref={(el: HTMLButtonElement|null) => { btnRefs.current[2] = el; }}
              onMouseEnter={() => { if(mouseEnabled) setFocusIndex(2); }}
            >{t('menu_credits')}</Button>
            {/* simulate error removed */}
          </div>
        </div>

        <div className={styles.footer}>{t('menu_footer')}</div>
      </Layout>
    </div>
  );
}
