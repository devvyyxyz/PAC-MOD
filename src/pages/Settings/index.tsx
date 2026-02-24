import React, {useEffect, useState} from 'react';
import menuStyles from '../../components/Menu/Menu.module.css';
import Button from '../../components/Button';
import styles from './Settings.module.css';
import SETTINGS, { SettingMeta } from '../../config/settings';
import config from '../../config';
import { useI18n, Layout, Grid, useToast } from '../../components';
import { useKeyboardNavigation } from '../../hooks';
import { Toggle, Select, Range, NumberInput } from '../../components/Controls';
import Card from '../../components/Card/Card';
import { DEFAULT_CONFIG } from '../../config/defaults';

type LocalSettings = Record<string, any>;

export default function Settings({onBack}:{onBack:()=>void}){
  const [local, setLocal] = useState<LocalSettings>({});
  const toast = useToast();
  const { t, setLocale } = useI18n();
  const [section, setSection] = useState<string>('all');
  const btnRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const navRefs = React.useRef<Array<HTMLLIElement | null>>([]);
  const leftButtonRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const leftColumnRef = React.useRef<HTMLElement | null>(null);
  const rightColumnRef = React.useRef<HTMLElement | null>(null);
  
  const [savedKeyboardEnabled, setSavedKeyboardEnabled] = React.useState<boolean>(()=>{
    try{ return config.loadConfig().settings?.keyboardNavigation !== false; }catch(e){ return true; }
  });
  const [savedMouseEnabled, setSavedMouseEnabled] = React.useState<boolean>(()=>{
    try{ return config.loadConfig().settings?.mouseNavigation !== false; }catch(e){ return true; }
  });
  useEffect(()=>{
    const cfg = config.loadConfig();
    setLocal({...cfg.settings});
  },[]);
  

  function update(key:string, value:any){
    const next = {...local, [key]: value};
    setLocal(next);
    // No autosave: changes are staged in `local` and will be persisted
    // only when the user presses Apply.

  }

  React.useEffect(()=>{
    if(!savedKeyboardEnabled) return;
    function idxOf(el: Element | null, arr: Array<Element | null>){
      if(!el) return -1;
      // try direct match first
      const direct = arr.findIndex(a => a === el);
      if(direct >= 0) return direct;
      // fallback: find the first element in arr that contains the active element
      return arr.findIndex(a => a && a.contains(el));
    }

    function handleKey(e: KeyboardEvent){
      const k = e.key.toLowerCase();
      // determine which keys are active based on controlScheme in local edits (user-facing)
      const scheme = (local.controlScheme as 'arrow'|'wasd') || 'arrow';
      const leftKey = scheme === 'wasd' ? 'a' : 'arrowleft';
      const rightKey = scheme === 'wasd' ? 'd' : 'arrowright';
      const upKey = scheme === 'wasd' ? 'w' : 'arrowup';
      const downKey = scheme === 'wasd' ? 's' : 'arrowdown';
      if(![leftKey, rightKey, upKey, downKey].includes(k)) return;
      const active = document.activeElement as Element | null;
      // build left column list: nav items then left buttons
      const leftList: Array<HTMLElement | null> = [];
      navRefs.current.forEach(n=> leftList.push(n));
      leftButtonRefs.current.forEach(b=> leftList.push(b));

      const rightList = btnRefs.current as Array<HTMLElement | null>;

      const leftIdx = idxOf(active, leftList as any);
      const rightIdx = idxOf(active, rightList as any);

      // up/down within current column (prefer containment check)
      if(k === upKey){
        e.preventDefault();
        if(leftIdx >= 0){ const next = Math.max(0, leftIdx - 1); leftList[next]?.focus(); }
        else if(rightIdx >= 0){ const next = Math.max(0, rightIdx - 1); rightList[next]?.focus(); }
        return;
      }
      if(k === downKey){
        e.preventDefault();
        if(leftIdx >= 0){ const next = Math.min(leftList.length - 1, leftIdx + 1); leftList[next]?.focus(); }
        else if(rightIdx >= 0){ const next = Math.min(rightList.length - 1, rightIdx + 1); rightList[next]?.focus(); }
        return;
      }

      // horizontal: move between columns keeping index
      if(k === rightKey){
        e.preventDefault();
        if(leftIdx >= 0){ const target = Math.min(rightList.length - 1, leftIdx); rightList[target]?.focus(); }
        else if(rightIdx >= 0){ /* already right side */ }
        return;
      }
      if(k === leftKey){
        e.preventDefault();
        if(rightIdx >= 0){ const target = Math.min(navRefs.current.length - 1, rightIdx); navRefs.current[target]?.focus(); }
        else if(leftIdx >= 0){ /* already left side */ }
        return;
      }
    }

    window.addEventListener('keydown', handleKey);
    return ()=> window.removeEventListener('keydown', handleKey);
  }, [savedKeyboardEnabled, navRefs, leftButtonRefs, btnRefs, local.controlScheme]);

  const SECTIONS = React.useMemo(() => {
    const cats = Array.from(new Set(SETTINGS.map(s => s.category).filter(Boolean)));
    const base = [{ id: 'all', items: SETTINGS.map(s => s.id) }];
    const rest = cats.map(c => ({ id: c, items: SETTINGS.filter(s => s.category === c).map(s => s.id) }));
    return [...base, ...rest];
  }, []);

  const withLabels = SECTIONS.map(s => ({ ...s, label: (
    // prefer explicit translation key if present, otherwise humanize the id
    (t(`settings_section_${s.id}`) !== `settings_section_${s.id}` ? t(`settings_section_${s.id}`) : (s.id.charAt(0).toUpperCase() + s.id.slice(1)))
  )}));

  const activeSection = withLabels.find(s=>s.id===section) || withLabels[0];
  const visibleSettings = SETTINGS.filter(s=> activeSection.items.includes(s.id));

  // local contains unsaved edits; saved* hold persisted values until Apply is pressed
  // const keyboardEnabled = local.keyboardNavigation !== false;
  // const mouseEnabled = local.mouseNavigation !== false;
  const visibleSettingsCount = visibleSettings.length;

  const { focusIndex, setFocusIndex, activeInput, setActiveInput, onMouseEnter } = useKeyboardNavigation({
    length: visibleSettingsCount,
    controlScheme: (local.controlScheme as 'arrow'|'wasd') || 'arrow',
    axis: 'vertical',
    // only enable navigation hook when keyboard navigation is enabled in SAVED config, not local edits
    enabled: savedKeyboardEnabled,
    starting: false,
    btnRefs: btnRefs as any,
    containerRef: rightColumnRef as any,
    onActivate: (idx) => {
      // focus or activate the control inside the setting row
      const root = btnRefs.current[idx];
      if(!root) return;
      const ctrl = root.querySelector('input, select, button, [tabindex]:not([tabindex="-1"])') as HTMLElement | null;
      if(!ctrl) return;
      try{
        // toggle checkboxes directly
        if(ctrl.tagName === 'INPUT' && (ctrl as HTMLInputElement).type === 'checkbox'){
          (ctrl as HTMLInputElement).click();
          // clicking can blur focus; restore focus to the row so keyboard navigation keeps working
          setTimeout(()=>{ try{ root.focus(); }catch(e){} }, 0);
          return;
        }
        // otherwise focus the control so native keys work (space, arrows)
        ctrl.focus();
      }catch(e){}
    }
  });

  // keep savedKeyboardEnabled in sync with persisted config
  React.useEffect(()=>{
    function onCfg(e: Event){
      try{
        const detail = (e as CustomEvent).detail as any;
        setSavedKeyboardEnabled(detail?.settings?.keyboardNavigation !== false);
        setSavedMouseEnabled(detail?.settings?.mouseNavigation !== false);
        setSavedSettings(detail?.settings || {});
      }catch(e){}
    }
    window.addEventListener('pacman.config.changed', onCfg as EventListener);
    return ()=> window.removeEventListener('pacman.config.changed', onCfg as EventListener);
  },[]);

  const [savedSettings, setSavedSettings] = React.useState<Record<string, any>>(() => {
    try{ return config.loadConfig().settings || {}; }catch(e){ return {}; }
  });

  const isDirty = React.useMemo(()=>{
    try{ return JSON.stringify(local || {}) !== JSON.stringify(savedSettings || {}); }catch(e){ return false; }
  },[local, savedSettings]);

  function handleApply(){
    try{
      config.saveConfig({settings: local as any});
      setSavedSettings(local);
      setSavedKeyboardEnabled(local.keyboardNavigation !== false);
      setSavedMouseEnabled(local.mouseNavigation !== false);
      // notify listeners that config changed and was applied
      window.dispatchEvent(new CustomEvent('pacman.config.changed', { detail: { settings: local } }));
      window.dispatchEvent(new CustomEvent('pacman.config.applied', { detail: { settings: local } }));
      try{ toast.show({ title: t('settings_saved') || 'Saved', message: t('settings_saved_message') || '', type: 'success' }); }catch(e){}
    }catch(e){
      console.error(e);
      try{ toast.show({ title: t('settings_save_failed') || 'Save failed', message: '', type: 'error' }); }catch(e){}
    }
  }

  function handleReset(){
    // restore persisted settings (discard local changes)
    setLocal(savedSettings || {});
  }

  function renderControl(s: SettingMeta){
    const val = (local && typeof local[s.id] !== 'undefined') ? local[s.id] : (savedSettings && typeof savedSettings[s.id] !== 'undefined' ? savedSettings[s.id] : (DEFAULT_CONFIG.settings as any)[s.id]);
    const disabled = s.implemented === false;
    // Only show the transient "Saved" indicator for keys that were just autosaved
    // (controlled via `savedKey`). Previously we also compared against persisted
    // `savedSettings`, which made all controls show "Saved" when local equals
    // persisted — remove that behavior.
    const saved = false;

    switch(s.type){
      case 'toggle':
        return <Toggle checked={!!val} onChange={(v)=>update(s.id, v)} disabled={disabled} saved={saved} label={null} />;
      case 'select':
        return <Select value={String(val || '')} onChange={(v)=>update(s.id, v)} options={(s.options||[])} disabled={disabled} saved={saved} />;
      case 'range':
        return <Range value={Number(val||0)} onChange={(n)=>update(s.id, n)} min={0} max={100} step={1} disabled={disabled} saved={saved} />;
      case 'number':
        return <NumberInput value={Number(val||0)} onChange={(n)=>update(s.id, n)} disabled={disabled} saved={saved} />;
      default:
        return null;
    }
  }

  // NOTE: global keyboard handling is managed by the other effect above

  // Prevent scroll chaining: trap wheel/touch events on the left and right
  // sidebar so scrolling there doesn't move the page behind it. This is a
  // JS fallback for browsers that don't fully respect `overscroll-behavior`.
  React.useEffect(()=>{
    const els: Array<HTMLElement | null> = [leftColumnRef.current, rightColumnRef.current];
    const handlers: Array<() => void> = [];

    els.forEach((el)=>{
      if(!el) return;
      // Wheel handler
      const onWheel = (e: WheelEvent) => {
        // Only run when there's vertical scroll
        if(Math.abs(e.deltaY) < 1) return;
        const delta = e.deltaY;
        const atTop = el.scrollTop === 0;
        const atBottom = Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) < 1;
        if((delta < 0 && atTop) || (delta > 0 && atBottom)){
          e.preventDefault();
          e.stopPropagation();
        }
      };
      el.addEventListener('wheel', onWheel as EventListener, { passive: false });

      // Touch handling for mobile
      let startY = 0;
      const onTouchStart = (ev: TouchEvent) => { startY = ev.touches?.[0]?.clientY || 0; };
      const onTouchMove = (ev: TouchEvent) => {
        const y = ev.touches?.[0]?.clientY || 0;
        const delta = startY - y;
        const atTop = el.scrollTop === 0;
        const atBottom = Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) < 1;
        if((delta < 0 && atTop) || (delta > 0 && atBottom)){
          ev.preventDefault();
          ev.stopPropagation();
        }
      };
      el.addEventListener('touchstart', onTouchStart, { passive: true } as any);
      el.addEventListener('touchmove', onTouchMove as EventListener, { passive: false } as any);

      handlers.push(()=>{
        try{ el.removeEventListener('wheel', onWheel as EventListener); }catch(e){}
        try{ el.removeEventListener('touchstart', onTouchStart as EventListener); }catch(e){}
        try{ el.removeEventListener('touchmove', onTouchMove as EventListener); }catch(e){}
      });
    });

    return ()=> handlers.forEach(h=>h());
  }, [leftColumnRef, rightColumnRef]);

  // Disable body scrolling while Settings is active on desktop so the inner
  // sticky sidebars remain visible. Restore on unmount. Mobile keeps native
  // scrolling behavior.
  React.useEffect(()=>{
    if(typeof window === 'undefined') return;
    if(window.innerWidth < 800) return;
    const prevBody = document.body.style.overflow;
    const prevDoc = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return ()=>{
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevDoc;
    };
  }, []);

  return (
    <Layout title={t('settings_title')} subtitle={t('settings_subtitle')} sticky>
      <div className={`${styles.wrap} ${activeInput === 'keyboard' ? 'no-mouse' : ''}`}>
        <div className={styles.stage}>

          <div className={styles.layout}>
            <aside className={styles.left} ref={(el)=>{ leftColumnRef.current = el; }}>
              <ul className={styles.navList}>
                {withLabels.map((sec, secIndex) => {
                  const items = SETTINGS.filter(s => sec.items.includes(s.id));
                  const count = items.length;
                  const disabled = items.filter(s => s.implemented === false).length;
                    return (
                      <li
                        key={sec.id}
                        className={`${styles.navItem} ${section===sec.id?styles.active:''}`}
                        onClick={()=>setSection(sec.id)}
                        tabIndex={0}
                        ref={(el)=>{ navRefs.current[secIndex] = el; }}
                        onKeyDown={(e)=>{
                          const k = e.key.toLowerCase();
                          if(k === 'enter' || k === ' '){ e.preventDefault(); e.stopPropagation(); setSection(sec.id); }
                          if(k === 'arrowright' || k === 'd'){
                            e.preventDefault(); e.stopPropagation();
                            // focus first setting row
                            const first = btnRefs.current[0] as HTMLElement | null | undefined;
                            if(first) { try{ first.focus(); }catch{} }
                          }
                          if(k === 'arrowleft' || k === 'a'){
                            e.preventDefault(); e.stopPropagation();
                            // focus first left button (Apply)
                            const lb = leftButtonRefs.current[0] as HTMLElement | null | undefined;
                            if(lb) try{ lb.focus(); }catch{}
                          }
                          if(k === 'arrowup' || k === 'arrowdown'){
                            // move between nav items
                            e.preventDefault(); e.stopPropagation();
                            const dir = k === 'arrowup' ? -1 : 1;
                            const next = (secIndex + dir + withLabels.length) % withLabels.length;
                            const el = navRefs.current[next];
                            if(el) try{ el.focus(); }catch{}
                          }
                        }}
                      >
                        <span className={styles.navLabel}>{sec.label}</span>
                        <span className={styles.navMeta}>
                          <span className={styles.badge}>{count}</span>
                          {disabled ? <small className={styles.badgeMuted}>{disabled} off</small> : null}
                        </span>
                      </li>
                    );
                })}
              </ul>
              <div className={styles.leftButtons}>
                <Button
                  variant="primary"
                  onClick={handleApply}
                  ref={(el: HTMLButtonElement | null) => { leftButtonRefs.current[0] = el; }}
                    onKeyDown={(e)=>{
                    const k = e.key.toLowerCase();
                    if(k === 'arrowright' || k === 'd'){
                      e.preventDefault(); e.stopPropagation();
                      const first = btnRefs.current[0] as HTMLElement | null | undefined;
                      if(first) try{ first.focus(); }catch{}
                    }
                    if(k === 'arrowdown' || k === 'arrowup'){
                      e.preventDefault(); e.stopPropagation();
                      const dir = k === 'arrowdown' ? 1 : -1;
                      const next = (0 + dir + 3) % 3;
                      const el = leftButtonRefs.current[next];
                      if(el) try{ el.focus(); }catch{}
                    }
                  }}
                >{t('settings_apply')}</Button>

                <Button
                  variant="secondary"
                  onClick={handleReset}
                  ref={(el: HTMLButtonElement | null) => { leftButtonRefs.current[1] = el; }}
                    onKeyDown={(e)=>{
                    const k = e.key.toLowerCase();
                    if(k === 'arrowright' || k === 'd'){
                      e.preventDefault(); e.stopPropagation();
                      const first = btnRefs.current[0] as HTMLElement | null | undefined;
                      if(first) try{ first.focus(); }catch{}
                    }
                    if(k === 'arrowdown' || k === 'arrowup'){
                      e.preventDefault(); e.stopPropagation();
                      const dir = k === 'arrowdown' ? 1 : -1;
                      const next = (1 + dir + 3) % 3;
                      const el = leftButtonRefs.current[next];
                      if(el) try{ el.focus(); }catch{}
                    }
                  }}
                >{t('settings_reset')}</Button>

                <Button
                  variant="secondary"
                  onClick={onBack}
                  ref={(el: HTMLButtonElement | null) => { leftButtonRefs.current[2] = el; }}
                    onKeyDown={(e)=>{
                    const k = e.key.toLowerCase();
                    if(k === 'arrowright' || k === 'd'){
                      e.preventDefault(); e.stopPropagation();
                      const first = btnRefs.current[0] as HTMLElement | null | undefined;
                      if(first) try{ first.focus(); }catch{}
                    }
                    if(k === 'arrowdown' || k === 'arrowup'){
                      e.preventDefault(); e.stopPropagation();
                      const dir = k === 'arrowdown' ? 1 : -1;
                      const next = (2 + dir + 3) % 3;
                      const el = leftButtonRefs.current[next];
                      if(el) try{ el.focus(); }catch{}
                    }
                  }}
                >{t('settings_back')}</Button>
              </div>
            </aside>

            <div className={styles.mobileSelect}>
              <label className={styles.mobileLabel} htmlFor="settings-section-select">{t('settings_section')}</label>
              <select id="settings-section-select" className={styles.mobileSelectControl} value={section} onChange={(e)=>setSection(e.target.value)}>
                {withLabels.map(sec => (
                  <option key={sec.id} value={sec.id}>{sec.label} ({SETTINGS.filter(s=>sec.items.includes(s.id)).length})</option>
                ))}
              </select>
            </div>

            <section className={styles.right} ref={(el)=>{ rightColumnRef.current = el; }}>
              {isDirty ? (
                <div className={styles.unsavedBanner}>
                  <div>{t('settings_unsaved_changes') || 'You have unsaved changes'}</div>
                  <div style={{display:'flex',gap:8}}>
                    <Button variant="primary" onClick={handleApply}>{t('settings_apply')}</Button>
                    <Button variant="secondary" onClick={handleReset}>{t('settings_reset')}</Button>
                  </div>
                </div>
              ) : null}

              {visibleSettings.map((s, i) => {
                const current = (local && typeof local[s.id] !== 'undefined') ? local[s.id] : (savedSettings && typeof savedSettings[s.id] !== 'undefined' ? savedSettings[s.id] : (DEFAULT_CONFIG.settings as any)[s.id]);
                const defaultVal = (DEFAULT_CONFIG.settings as any)[s.id];
                const changedFromDefault = (()=>{
                  try{ return JSON.stringify(current) !== JSON.stringify(defaultVal); }catch(e){ return current !== defaultVal; }
                })();
                return (
                <Card
                  key={s.id}
                  className={`${s.implemented===false?styles.disabled:''} ${s.id==='difficulty' || s.id==='skin'?styles.full:''}`}
                  overlayLabel={s.implemented === false ? t('coming_soon') : null}
                >
                  <div
                    className={styles.settingRow}
                    tabIndex={0}
                    ref={(el) => { btnRefs.current[i] = el; }}
                    onMouseEnter={() => { if(savedMouseEnabled) onMouseEnter(i); }}
                    onFocus={() => { setActiveInput && setActiveInput('keyboard'); setFocusIndex(i); }}
                    onKeyDown={(e)=>{
                      const k = e.key.toLowerCase();
                      if(k === 'arrowleft' || k === 'a'){
                        // jump back to the left nav (so users can then navigate to left action buttons)
                        e.preventDefault(); e.stopPropagation();
                        const idx = withLabels.findIndex(s => s.id === section);
                        const navEl = navRefs.current[idx];
                        if(navEl) try{ navEl.focus(); }catch{}
                      }
                    }}
                  >
                    <div className={styles.settingInfo}>
                      <div className={styles.cardLabel}>
                        {t(s.labelKey || s.label || s.id)}
                        {changedFromDefault ? <span className={styles.changedBadge}>{t('settings_modified') || 'Modified'}</span> : null}
                      </div>
                      <div className={styles.cardDesc}>{s.description}</div>
                    </div>
                    <div className={styles.settingControl}>
                      {renderControl(s)}
                    </div>
                  </div>
                </Card>
              );
            })}
            </section>
          </div>

          
        </div>
      </div>
    </Layout>
  );
}
