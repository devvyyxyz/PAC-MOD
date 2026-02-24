import React from 'react';
import styles from './Menu.module.css';
import { useI18n, Layout } from '../../components';
import { useKeyboardNavigation } from '../../hooks';
import config from '../../config';
import AUDIO from '../../config/audio';
import Title from '../Title';
import Icon from '../Icon/Icon';
import { playSfx } from '../../utils/audio';
import Button from '../Button';

type Props = { onStart?: () => void, onOpenSettings?: ()=>void, onOpenCredits?: ()=>void, onError?: ()=>void };

export default function Menu({onStart, onOpenSettings, onOpenCredits, onError}: Props) {
  const [starting, setStarting] = React.useState(false);
  const [keyboardEnabled, setKeyboardEnabled] = React.useState(true);
  const [mouseEnabled, setMouseEnabled] = React.useState(true);
  // keyboard navigation (focus + input-source tracking)
  const btnRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const [controlScheme, setControlScheme] = React.useState<'arrow'|'wasd'>('arrow');
  const isDev = Boolean((import.meta as any).env?.DEV);
  const buttonCount = isDev ? 4 : 3;
  const { focusIndex, setFocusIndex, activeInput, setActiveInput, onMouseEnter } = useKeyboardNavigation({
    length: buttonCount,
    controlScheme: controlScheme,
    enabled: true,
    starting: starting,
    btnRefs: btnRefs as any,
    onActivate: (idx)=>{
      if(idx === 0) handleStart();
      if(idx === 1) handleSettings();
      if(idx === 2) handleCredits();
      if(idx === 3) handleError();
    }
  });
  
  const { t } = useI18n();
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(()=>{
    try{
      const cfg = config.loadConfig();
      const enabled = cfg.settings?.music !== false;
      setKeyboardEnabled(cfg.settings?.keyboardNavigation !== false);
      setMouseEnabled(cfg.settings?.mouseNavigation !== false);
      setControlScheme((cfg.settings?.controlScheme as 'arrow'|'wasd') || 'arrow');
      // play configured menu ambience via utils so audio is managed from config
      if(enabled){
        // lazy require to avoid circulars
        const audioUtils = require('../../utils/audio') as typeof import('../../utils/audio');
        audioRef.current = audioUtils.playMusic ? audioUtils.playMusic('menuAmbience') : null;
      }
    }catch(e){ /* ignore */ }

    function handleCfgChange(e: Event){
      try{
        const detail = (e as CustomEvent).detail as any;
        const enabled = detail?.settings?.music !== false;
        const vol = (typeof detail?.settings?.volume === 'number') ? (detail.settings.volume / 100) : 0.7;
        setKeyboardEnabled(detail?.settings?.keyboardNavigation !== false);
        setMouseEnabled(detail?.settings?.mouseNavigation !== false);
        setActiveInput && setActiveInput('auto');
        setControlScheme((detail?.settings?.controlScheme as 'arrow'|'wasd') || 'arrow');
        const audioUtils = require('../../utils/audio') as typeof import('../../utils/audio');
        if(enabled){
          audioRef.current = audioUtils.playMusic ? audioUtils.playMusic('menuAmbience') : audioRef.current;
        }else{
          audioUtils.stopMusic && audioUtils.stopMusic();
          audioRef.current = null;
        }
      }catch(err){ }
    }

    window.addEventListener('pacman.config.changed', handleCfgChange as EventListener);
    return () => {
      try{ window.removeEventListener('pacman.config.changed', handleCfgChange as EventListener); const audioUtils = require('../../utils/audio') as typeof import('../../utils/audio'); audioUtils.stopMusic && audioUtils.stopMusic(); audioRef.current = null; }catch(e){}
    };
  },[]);

  // keyboard navigation handled by hook (useKeyboardNavigation)

  function handleStart() {
    if (starting) return;
    playSfx('uiClick');
    setStarting(true);
    setTimeout(() => { if (onStart) onStart(); }, 600);
  }

  function handleSettings(){ playSfx('uiClick'); if(onOpenSettings) onOpenSettings(); }
  function handleCredits(){ playSfx('uiClick'); if(onOpenCredits) onOpenCredits(); }
  function handleError(){ if(onError) onError(); }

  return (
    <div className={`${styles.wrap} ${starting ? styles.starting : ''} ${activeInput === 'keyboard' ? 'no-mouse' : ''}`}>
      <div className={styles.bg} aria-hidden />
      <Layout stageClassName={styles.stage}>
            <div className={styles.title}>
              <Title title={"PAC-MOD"} subtitle={t('menu_subtitle')} className={styles.title} />
            </div>

        <div className={styles.controls} role="navigation" aria-label="Main menu">
            <Button
              variant="primary"
              className={`${styles.menuButton} ${styles.hasIcon}`}
              onClick={handleStart}
              autoFocus
              aria-disabled={starting}
              ref={(el: HTMLButtonElement|null) => { btnRefs.current[0] = el; }}
              onMouseEnter={() => { if(mouseEnabled) onMouseEnter(0); }}
            ><Icon name="play" size={20} className={styles.menuIcon} /><span className={styles.btnLabel}>{starting ? t('starting') : t('start_game')}</span></Button>

          <div className={styles.row}>
            <Button
              variant="secondary"
              className={`${styles.menuButton} ${styles.hasIcon}`}
              onClick={handleSettings}
              ref={(el: HTMLButtonElement|null) => { btnRefs.current[1] = el; }}
              onMouseEnter={() => { if(mouseEnabled) onMouseEnter(1); }}
            ><Icon name="settings" size={18} className={styles.menuIcon} /><span className={styles.btnLabel}>{t('menu_settings')}</span></Button>
            <Button
              variant="secondary"
              className={`${styles.menuButton} ${styles.hasIcon}`}
              onClick={handleCredits}
              ref={(el: HTMLButtonElement|null) => { btnRefs.current[2] = el; }}
              onMouseEnter={() => { if(mouseEnabled) onMouseEnter(2); }}
            ><Icon name="ghost" size={18} className={styles.menuIcon} /><span className={styles.btnLabel}>{t('menu_credits')}</span></Button>
            {isDev ? (
              <Button
                variant="secondary"
                className={`${styles.menuButton} ${styles.hasIcon}`}
                onClick={handleError}
                ref={(el: HTMLButtonElement|null) => { btnRefs.current[3] = el; }}
                onMouseEnter={() => { if(mouseEnabled) onMouseEnter(3); }}
                title="Simulate Error (dev)"
              ><Icon name="skull" size={18} className={styles.menuIcon} /><span className={styles.btnLabel}>{t('menu_simulate_error')}</span></Button>
            ) : null}
          </div>
        </div>

        <div className={styles.footer}>{t('menu_footer')}</div>
      </Layout>
    </div>
  );
}
