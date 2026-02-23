import React from 'react';
import styles from './Menu.module.css';
import { useI18n, Layout } from '../../components';
import config from '../../config';
import Title from '../Title';
import { playChomp } from '../../utils/audio';
import Button from '../Button';

type Props = { onStart?: () => void, onOpenSettings?: ()=>void, onOpenCredits?: ()=>void, onError?: ()=>void };

export default function Menu({onStart, onOpenSettings, onOpenCredits, onError}: Props) {
  const [starting, setStarting] = React.useState(false);
  const { t } = useI18n();
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(()=>{
    try{
      const cfg = config.loadConfig();
      const enabled = cfg.settings?.music !== false;
      const vol = (typeof cfg.settings?.volume === 'number') ? (cfg.settings.volume / 100) : 0.7;
      const src = encodeURI('/assets/audio/GameSFX/Ambience/Retro Ambience Short 09.wav');
      const a = new Audio(src);
      a.loop = true;
      a.volume = vol;
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
          <Button variant="primary" className={styles.menuButton} onClick={handleStart} autoFocus aria-disabled={starting}>{starting ? t('starting') : t('start_game')}</Button>

          <div className={styles.row}>
            <Button variant="secondary" className={styles.menuButton} onClick={handleSettings}>{t('menu_settings')}</Button>
            <Button variant="secondary" className={styles.menuButton} onClick={handleCredits}>{t('menu_credits')}</Button>
            {/* simulate error removed */}
          </div>
        </div>

        <div className={styles.footer}>{t('menu_footer')}</div>
      </Layout>
    </div>
  );
}
