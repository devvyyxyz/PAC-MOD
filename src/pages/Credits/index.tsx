import React from 'react';
import menuStyles from '../../components/Menu/Menu.module.css';
import Button from '../../components/Button';
import styles from './Credits.module.css';
import CREDITS from '../../config/credits';
import { useI18n, Grid } from '../../components';
import Title from '../../components/Title';
import config from '../../config';

export default function Credits({onBack}:{onBack:()=>void}){
  const { t } = useI18n();
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const [keyboardEnabled, setKeyboardEnabled] = React.useState(true);
  const [controlScheme, setControlScheme] = React.useState<'arrow'|'wasd'>('arrow');
  const [focusIndex, setFocusIndex] = React.useState(0);

  React.useEffect(()=>{
    try{
      const cfg = config.loadConfig();
      setKeyboardEnabled(cfg.settings?.keyboardNavigation !== false);
      setControlScheme((cfg.settings?.controlScheme as 'arrow'|'wasd') || 'arrow');
    }catch(e){}

    function onCfg(e: Event){
      try{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const detail = (e as CustomEvent).detail as any;
        setKeyboardEnabled(detail?.settings?.keyboardNavigation !== false);
        setControlScheme((detail?.settings?.controlScheme as 'arrow'|'wasd') || 'arrow');
      }catch(_){}
    }
    window.addEventListener('pacman.config.changed', onCfg as EventListener);
    return ()=> window.removeEventListener('pacman.config.changed', onCfg as EventListener);
  },[]);

  // manage keyboard navigation within credits
  React.useEffect(()=>{
    if(!keyboardEnabled) return;
    function getFocusable(){
      const root = stageRef.current;
      if(!root) return [] as HTMLElement[];
      const nodes = Array.from(root.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])')) as HTMLElement[];
      return nodes.filter(n => !n.hasAttribute('disabled'));
    }

    function focusByIndex(i:number){
      const nodes = getFocusable();
      if(nodes.length === 0) return;
      const idx = ((i % nodes.length) + nodes.length) % nodes.length;
      const el = nodes[idx];
      try{ el.focus(); nodes.forEach((n,j)=>{ if(j===idx) n.setAttribute('data-focused','true'); else n.removeAttribute('data-focused'); }); }catch(_){}
    }

    function handleKey(e: KeyboardEvent){
      const k = e.key.toLowerCase();
      const isUp = (controlScheme === 'wasd') ? (k === 'w') : (k === 'arrowup');
      const isDown = (controlScheme === 'wasd') ? (k === 's') : (k === 'arrowdown');
      if(isUp){ e.preventDefault(); setFocusIndex(i => { const next = i - 1; focusByIndex(next); return next; }); return; }
      if(isDown){ e.preventDefault(); setFocusIndex(i => { const next = i + 1; focusByIndex(next); return next; }); return; }
      if(k === 'enter' || k === ' '){ e.preventDefault(); const nodes = getFocusable(); const el = nodes[((focusIndex % nodes.length)+nodes.length)%nodes.length]; if(el) (el as HTMLButtonElement).click(); }
    }

    window.addEventListener('keydown', handleKey);
    // initialize focus to first focusable element
    setTimeout(()=> focusByIndex(focusIndex), 50);
    return ()=> window.removeEventListener('keydown', handleKey);
  },[keyboardEnabled, controlScheme, focusIndex]);

  
  return (
    <div className={`${menuStyles.wrap} ${styles.pageWrap}`}>
      <div className={menuStyles.bg} aria-hidden />
      <div className={menuStyles.stage} role="main" ref={stageRef}>
        <Title title={t('credits_title')} subtitle={t('credits_subtitle')} sticky className={`${menuStyles.title} ${styles.stickyTitle}`} />

        <Grid className={styles.cards} columns={{sm:1,md:2,lg:3}} gap={16}>
          {CREDITS.map(c => {
            const CardInner = (
              <div className={styles.card}>
                <div>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIcon} aria-hidden>
                      {c.icon ? <img src={c.icon} alt="" style={{width:28,height:28}}/> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffd84d" strokeWidth="1.5"><circle cx="12" cy="12" r="6" /></svg>}
                    </div>
                    <div>
                      <h4 className={styles.cardTitle}>{c.name}</h4>
                      {c.role && <div className={styles.cardRole}>{c.role}</div>}
                    </div>
                  </div>
                  {c.note && <div className={styles.cardNote}>{c.note}</div>}
                </div>
                {c.url && <div className={styles.cardFooter}><div className={styles.cardLink}>{t('visit')}</div></div>}
              </div>
            );

            if(c.url){
              return (
                <a key={c.id} className={styles.cardLinkWrap} href={c.url} target="_blank" rel="noopener noreferrer">
                  {CardInner}
                </a>
              );
            }

            return <div key={c.id}>{CardInner}</div>;
          })}
        </Grid>

        <div style={{marginTop:18,width:'100%',display:'flex',justifyContent:'center'}}>
          <Button variant="secondary" onClick={onBack}>{t('return_menu')}</Button>
        </div>

        <div className={menuStyles.footer} style={{width:'100%',textAlign:'center'}}>{t('credits_footer')}</div>
      </div>
    </div>
  );
}
