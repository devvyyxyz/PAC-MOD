import React from 'react';
import menuStyles from '../../components/Menu/Menu.module.css';
import Button from '../../components/Button';
import styles from './Credits.module.css';
import CREDITS from '../../config/credits';
import { useI18n, Grid } from '../../components';
import Title from '../../components/Title';
import config from '../../config';
import { useKeyboardNavigation } from '../../hooks';

export default function Credits({onBack}:{onBack:()=>void}){
  const { t } = useI18n();
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const [keyboardEnabled, setKeyboardEnabled] = React.useState(true);
  const [mouseEnabled, setMouseEnabled] = React.useState(true);
  const [controlScheme, setControlScheme] = React.useState<'arrow'|'wasd'>('arrow');
  const btnRefs = React.useRef<Array<HTMLElement | null>>([]);
  const [focusableCount, setFocusableCount] = React.useState(0);
  const { focusIndex, setFocusIndex, activeInput, setActiveInput, onMouseEnter } = useKeyboardNavigation({
    length: focusableCount,
    controlScheme: controlScheme,
    axis: 'horizontal',
    enabled: keyboardEnabled,
    starting: false,
    btnRefs: btnRefs as any,
    containerRef: stageRef as any,
    onActivate: (idx) => {
      const nodes = btnRefs.current || [];
      const el = nodes[idx] as HTMLElement | undefined | null;
      if(el) try{ (el as HTMLButtonElement).click(); }catch(e){}
    }
  });

  React.useEffect(()=>{
    try{
      const cfg = config.loadConfig();
      setKeyboardEnabled(cfg.settings?.keyboardNavigation !== false);
      setMouseEnabled(cfg.settings?.mouseNavigation !== false);
      setControlScheme((cfg.settings?.controlScheme as 'arrow'|'wasd') || 'arrow');
    }catch(e){}

    function onCfg(e: Event){
      try{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const detail = (e as CustomEvent).detail as any;
        setKeyboardEnabled(detail?.settings?.keyboardNavigation !== false);
        setMouseEnabled(detail?.settings?.mouseNavigation !== false);
        setControlScheme((detail?.settings?.controlScheme as 'arrow'|'wasd') || 'arrow');
      }catch(_){}
    }
    window.addEventListener('pacman.config.changed', onCfg as EventListener);
    return ()=> window.removeEventListener('pacman.config.changed', onCfg as EventListener);
  },[]);

  // helper to ensure a focused card is visible and centered inside the stage
  function ensureStageVisible(el?: HTMLElement | null){
    try{
      const container = stageRef.current;
      if(!container || !el) return;
      const prevX = window.scrollX || window.pageXOffset || 0;
      const prevY = window.scrollY || window.pageYOffset || 0;
      try{
        el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'auto' });
        try{ requestAnimationFrame(()=> window.scrollTo(prevX, prevY)); }catch(e){ window.scrollTo(prevX, prevY); }
      }catch(e){
        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const offset = (elRect.top - containerRect.top) - (container.clientHeight / 2) + (el.clientHeight / 2);
        let target = Math.round(container.scrollTop + offset);
        target = Math.max(0, Math.min(target, container.scrollHeight - container.clientHeight));
        try{ container.scrollTo({ top: target, behavior: 'auto' }); }catch(e){ container.scrollTop = target; }
        try{ requestAnimationFrame(()=> window.scrollTo(prevX, prevY)); }catch(e){ window.scrollTo(prevX, prevY); }
      }
    }catch(e){}
  }

  // manage keyboard navigation within credits
  React.useEffect(()=>{
    // compute focusable nodes and wire them to btnRefs for the keyboard hook
    function getFocusable(){
      const root = stageRef.current;
      if(!root) return [] as HTMLElement[];
      const nodes = Array.from(root.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])')) as HTMLElement[];
      return nodes.filter(n => !n.hasAttribute('disabled'));
    }

    const nodes = getFocusable();
    btnRefs.current = nodes;
    setFocusableCount(nodes.length);

    // initialize focus to first focusable element
    // helper to focus without scrolling the viewport
    function safeFocus(el?: HTMLElement | null){ if(!el) return; try{ (el as HTMLElement).focus?.({ preventScroll: true } as any); }catch(e){ try{ (el as HTMLElement).focus(); }catch(e){} } }
    if(nodes.length) setTimeout(()=>{ try{ safeFocus(nodes[focusIndex]); nodes.forEach((n,j)=>{ if(j===focusIndex) n.setAttribute('data-focused','true'); else n.removeAttribute('data-focused'); }); }catch(e){} }, 50);

    // hook handles key events; just cleanup on unmount
    return ()=>{
      btnRefs.current = [];
    };
  },[keyboardEnabled, controlScheme, focusIndex]);

  // allow up/down navigation across the grid by computing column count
  React.useEffect(()=>{
    if(!keyboardEnabled) return;
    function handleGridNav(e: KeyboardEvent){
      const k = e.key.toLowerCase();
      // determine which keys are active based on controlScheme
      const upKey = controlScheme === 'wasd' ? 'w' : 'arrowup';
      const downKey = controlScheme === 'wasd' ? 's' : 'arrowdown';
      if(!(k === upKey || k === downKey)) return;
      const grid = stageRef.current?.querySelector('.' + styles.cards.split(' ').join('.')) as HTMLElement | null;
      if(!grid) return;
      const colsStyle = window.getComputedStyle(grid).gridTemplateColumns || '';
      const cols = colsStyle.trim() ? colsStyle.split(' ').length : 3;
      e.preventDefault();
      setActiveInput && setActiveInput('keyboard');
      // move up or down by 'cols'
      if(k === upKey){
        setFocusIndex(i => Math.max(0, i - cols));
      }else if(k === downKey){
        setFocusIndex(i => Math.min((focusableCount || 0) - 1, i + cols));
      }
    }
    window.addEventListener('keydown', handleGridNav);
    return ()=> window.removeEventListener('keydown', handleGridNav);
  }, [keyboardEnabled, focusableCount, setFocusIndex, setActiveInput]);

  
  return (
    <div className={`${menuStyles.wrap} ${styles.pageWrap} ${activeInput === 'keyboard' ? 'no-mouse' : ''}`}>
      <div className={menuStyles.bg} aria-hidden />
      <div className={menuStyles.stage} role="main" ref={stageRef}>
        <Title title={t('credits_title')} subtitle={t('credits_subtitle')} sticky className={`${menuStyles.title} ${styles.stickyTitle}`} />

        <Grid className={styles.cards} columns={{sm:1,md:2,lg:3}} gap={16}>
            {CREDITS.map((c, idx) => {
            const CardInner = (
              <div className={styles.card}>
                <div>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIcon} aria-hidden>
                      {c.icon ? <img src={c.icon} alt="" style={{width:28,height:28}}/> : <img src="/assets/icons/circle.svg" alt="" style={{width:20,height:20}} />}
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
                <a
                  key={c.id}
                  className={styles.cardLinkWrap}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={()=>{ if(mouseEnabled) onMouseEnter(idx); }}
                  onFocus={(e)=>{ setFocusIndex(idx); ensureStageVisible(e.currentTarget as HTMLElement); setActiveInput && setActiveInput('keyboard'); }}
                >
                  {CardInner}
                </a>
              );
            }

            return (
              <div
                key={c.id}
                className={styles.cardLinkWrap}
                tabIndex={0}
                onMouseEnter={()=>{ if(mouseEnabled) onMouseEnter(idx); }}
                onFocus={(e)=>{ setFocusIndex(idx); ensureStageVisible(e.currentTarget as HTMLElement); setActiveInput && setActiveInput('keyboard'); }}
              >
                {CardInner}
              </div>
            );
          })}
        </Grid>

        <div style={{marginTop:18,width:'100%',display:'flex',justifyContent:'center'}}>
          <Button variant="secondary" icon="close" onClick={onBack}>{t('back')}</Button>
        </div>

        <div className={menuStyles.footer} style={{width:'100%',textAlign:'center'}}>{t('credits_footer')}</div>
      </div>
    </div>
  );
}
