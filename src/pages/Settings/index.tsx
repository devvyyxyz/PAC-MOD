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
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const { t, setLocale } = useI18n();
  const [section, setSection] = useState<string>('all');
  const btnRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const navRefs = React.useRef<Array<HTMLLIElement | null>>([]);
  const leftButtonRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const leftColumnRef = React.useRef<HTMLElement | null>(null);
  const rightColumnRef = React.useRef<HTMLElement | null>(null);

  useEffect(()=>{
    const cfg = config.loadConfig();
    setLocal({...cfg.settings});
  },[]);
  

  function update(key:string, value:any){
    const next = {...local, [key]: value};
    setLocal(next);
    // autosave for some realtime controls (audio)
    const AUTOSAVE_KEYS = ['sound','music','volume','maxLives'];
    if(AUTOSAVE_KEYS.includes(key)){
      config.saveConfig({settings: next as any});
      setSavedKey(key);
      setTimeout(()=>{ if(savedKey===key) setSavedKey(null); }, 1500);
    }

  }

  function handleApply(){
    config.saveConfig({settings: local as any});
    if(local.locale) setLocale(local.locale);
    toast.show({ message: t('settings_applied'), type: 'success', duration: 2000 });
  }

  function renderControl(s: SettingMeta){
    const val = local[s.id];
    const disabled = s.implemented === false;
    const saved = savedKey === s.id;

    if(s.type === 'toggle'){
      return <Toggle checked={!!val} onChange={(v)=>update(s.id,v)} disabled={disabled} saved={saved} label={s.label} />;
    }
    if(s.type === 'select'){
      const displayOptions = s.options || [];
      return (
        <div>
          <Select value={val || displayOptions[0]} onChange={(v)=>update(s.id,v)} options={displayOptions} disabled={disabled} saved={saved} />
        </div>
      );
    }
    if(s.type === 'range'){
      const v = typeof val === 'number' ? val : 70;
      return <Range value={v} onChange={(n)=>update(s.id,n)} disabled={disabled} saved={saved} />;
    }
    if(s.type === 'number'){
      return <NumberInput value={val ?? 3} onChange={(n)=>update(s.id,n)} disabled={disabled} saved={saved} />;
    }
    if(s.id === 'locale'){
      const cur = local['locale'] || 'en';
      const NATIVE_LANG: Record<string,string> = { en: 'English', es: 'Español', pl: 'Polski' };
      return (
        <Select value={cur} onChange={(v)=>{ update('locale', v); setLocale(v); }} options={s.options || []} />
      );
    }
    return null;
  }

  function handleReset(){
    const defaults = DEFAULT_CONFIG.settings;
    config.saveConfig({settings: defaults});
    setLocal({...defaults});
  }

  // Build sections dynamically from `SETTINGS` categories.
  const CATEGORY_ORDER = ['audio','controls','gameplay','accessibility','online','general'];
  const foundCategories = Array.from(new Set(SETTINGS.map(s => s.category || 'general')));
  const orderedCategories = CATEGORY_ORDER.filter(c => foundCategories.includes(c)).concat(foundCategories.filter(c => !CATEGORY_ORDER.includes(c)));
  const SECTIONS: { id: string; label: string; items: string[] }[] = orderedCategories.map(cat => ({ id: cat, label: '', items: SETTINGS.filter(s => (s.category || 'general') === cat).map(s => s.id) }));

  // default selected section: first category
  React.useEffect(()=>{
    if(!section && SECTIONS.length){ setSection(SECTIONS[0].id); }
  },[SECTIONS, section]);

  function localLabel(key: string, fallback: string){
    const val = t(key);
    return (!val || val === key) ? fallback : val;
  }

  const withLabels = SECTIONS.map(s => ({ ...s, label: (
    // prefer explicit translation key if present, otherwise humanize the id
    (t(`settings_section_${s.id}`) !== `settings_section_${s.id}` ? t(`settings_section_${s.id}`) : (s.id.charAt(0).toUpperCase() + s.id.slice(1)))
  )}));

  const activeSection = withLabels.find(s=>s.id===section) || withLabels[0];
  const visibleSettings = SETTINGS.filter(s=> activeSection.items.includes(s.id));

  // local contains unsaved edits; saved* hold persisted values until Apply is pressed
  // const keyboardEnabled = local.keyboardNavigation !== false;
  // const mouseEnabled = local.mouseNavigation !== false;
  const [savedKeyboardEnabled, setSavedKeyboardEnabled] = React.useState<boolean>(()=>{
    try{ return config.loadConfig().settings?.keyboardNavigation !== false; }catch(e){ return true; }
  });
  const [savedMouseEnabled, setSavedMouseEnabled] = React.useState<boolean>(()=>{
    try{ return config.loadConfig().settings?.mouseNavigation !== false; }catch(e){ return true; }
  });
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
      }catch(e){}
    }
    window.addEventListener('pacman.config.changed', onCfg as EventListener);
    return ()=> window.removeEventListener('pacman.config.changed', onCfg as EventListener);
  },[]);

  // Global keyboard handler to switch focus between left column (nav + left buttons)
  // and right column (settings rows) using arrow keys or WASD.
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
      if(!['arrowleft','arrowright','arrowup','arrowdown','a','d','w','s'].includes(k)) return;
      const active = document.activeElement as Element | null;
      // build left column list: nav items then left buttons
      const leftList: Array<HTMLElement | null> = [];
      navRefs.current.forEach(n=> leftList.push(n));
      leftButtonRefs.current.forEach(b=> leftList.push(b));

      const rightList = btnRefs.current as Array<HTMLElement | null>;

      // determine which column currently contains focus using container refs
      const inLeft = leftColumnRef.current ? leftColumnRef.current.contains(active) : false;
      const inRight = rightColumnRef.current ? rightColumnRef.current.contains(active) : false;

      const leftIdx = idxOf(active, leftList as any);
      const rightIdx = idxOf(active, rightList as any);

      // up/down within current column (prefer containment check)
      if(k === 'arrowup' || k === 'w'){
        e.preventDefault();
        if(inLeft){ const next = Math.max(0, leftIdx - 1); leftList[next]?.focus(); }
        else if(inRight){ const next = Math.max(0, rightIdx - 1); rightList[next]?.focus(); }
        return;
      }
      if(k === 'arrowdown' || k === 's'){
        e.preventDefault();
        if(inLeft){ const next = Math.min(leftList.length - 1, leftIdx + 1); leftList[next]?.focus(); }
        else if(inRight){ const next = Math.min(rightList.length - 1, rightIdx + 1); rightList[next]?.focus(); }
        return;
      }

      // horizontal: move between columns keeping index
      if(k === 'arrowright' || k === 'd'){
        e.preventDefault();
        if(leftIdx >= 0){ const target = Math.min(rightList.length - 1, leftIdx); rightList[target]?.focus(); }
        else if(rightIdx >= 0){ /* already right side */ }
        return;
      }
      if(k === 'arrowleft' || k === 'a'){
        e.preventDefault();
        if(rightIdx >= 0){ const target = Math.min(navRefs.current.length - 1, rightIdx); navRefs.current[target]?.focus(); }
        else if(leftIdx >= 0){ /* already left side */ }
        return;
      }
    }

    window.addEventListener('keydown', handleKey);
    return ()=> window.removeEventListener('keydown', handleKey);
  }, [savedKeyboardEnabled, navRefs, leftButtonRefs, btnRefs, visibleSettingsCount]);

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
                          if(k === 'enter' || k === ' '){ e.preventDefault(); setSection(sec.id); }
                          if(k === 'arrowright' || k === 'd'){
                            e.preventDefault();
                            // focus first setting row
                            const first = btnRefs.current[0] as HTMLElement | null | undefined;
                            if(first) { try{ first.focus(); }catch{} }
                          }
                          if(k === 'arrowleft' || k === 'a'){
                            e.preventDefault();
                            // focus first left button (Apply)
                            const lb = leftButtonRefs.current[0] as HTMLElement | null | undefined;
                            if(lb) try{ lb.focus(); }catch{}
                          }
                          if(k === 'arrowup' || k === 'arrowdown'){
                            // move between nav items
                            e.preventDefault();
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
                      e.preventDefault();
                      const first = btnRefs.current[0] as HTMLElement | null | undefined;
                      if(first) try{ first.focus(); }catch{}
                    }
                    if(k === 'arrowdown' || k === 'arrowup'){
                      e.preventDefault();
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
                      e.preventDefault();
                      const first = btnRefs.current[0] as HTMLElement | null | undefined;
                      if(first) try{ first.focus(); }catch{}
                    }
                    if(k === 'arrowdown' || k === 'arrowup'){
                      e.preventDefault();
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
                      e.preventDefault();
                      const first = btnRefs.current[0] as HTMLElement | null | undefined;
                      if(first) try{ first.focus(); }catch{}
                    }
                    if(k === 'arrowdown' || k === 'arrowup'){
                      e.preventDefault();
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
              {visibleSettings.map((s, i) => (
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
                        e.preventDefault();
                        const idx = withLabels.findIndex(s => s.id === section);
                        const navEl = navRefs.current[idx];
                        if(navEl) try{ navEl.focus(); }catch{}
                      }
                    }}
                  >
                    <div className={styles.settingInfo}>
                      <div className={styles.cardLabel}>{t(s.labelKey || s.label || s.id)}</div>
                      <div className={styles.cardDesc}>{s.description}</div>
                    </div>
                    <div className={styles.settingControl}>
                      {renderControl(s)}
                    </div>
                  </div>
                </Card>
              ))}
            </section>
          </div>

          
        </div>
      </div>
    </Layout>
  );
}
