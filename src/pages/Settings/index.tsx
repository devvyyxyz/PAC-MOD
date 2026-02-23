import React, {useEffect, useState} from 'react';
import menuStyles from '../../components/Menu/Menu.module.css';
import Button from '../../components/Button';
import styles from './Settings.module.css';
import SETTINGS, { SettingMeta } from '../../config/settings';
import config from '../../config';
import { useI18n, Layout, Grid, useToast } from '../../components';
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

  // Build sections dynamically from `SETTINGS` categories. Keep 'all' first.
  const CATEGORY_ORDER = ['audio','controls','gameplay','accessibility','online','general'];
  const foundCategories = Array.from(new Set(SETTINGS.map(s => s.category || 'general')));
  const orderedCategories = CATEGORY_ORDER.filter(c => foundCategories.includes(c)).concat(foundCategories.filter(c => !CATEGORY_ORDER.includes(c)));
  const SECTIONS: { id: string; label: string; items: string[] }[] = [
    { id: 'all', label: '', items: SETTINGS.map(s => s.id) },
    ...orderedCategories.map(cat => ({ id: cat, label: '', items: SETTINGS.filter(s => (s.category || 'general') === cat).map(s => s.id) }))
  ];

  function localLabel(key: string, fallback: string){
    const val = t(key);
    return (!val || val === key) ? fallback : val;
  }

  const withLabels = SECTIONS.map(s => ({ ...s, label: (
    s.id === 'all' ? localLabel('settings_section_all','All') :
    // prefer explicit translation key if present, otherwise humanize the id
    (t(`settings_section_${s.id}`) !== `settings_section_${s.id}` ? t(`settings_section_${s.id}`) : (s.id.charAt(0).toUpperCase() + s.id.slice(1)))
  )}));

  const activeSection = withLabels.find(s=>s.id===section) || withLabels[0];
  const visibleSettings = SETTINGS.filter(s=> activeSection.items.includes(s.id));

  return (
    <Layout title={t('settings_title')} subtitle={t('settings_subtitle')} sticky>
      <div className={styles.wrap}>
        <div className={styles.stage}>

          <div className={styles.layout}>
            <aside className={styles.left}>
              <ul className={styles.navList}>
                {withLabels.map(sec => {
                  const items = SETTINGS.filter(s => sec.items.includes(s.id));
                  const count = items.length;
                  const disabled = items.filter(s => s.implemented === false).length;
                  return (
                    <li key={sec.id} className={`${styles.navItem} ${section===sec.id?styles.active:''}`} onClick={()=>setSection(sec.id)}>
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
                <Button variant="primary" onClick={handleApply}>{t('settings_apply')}</Button>
                <Button variant="secondary" onClick={handleReset}>{t('settings_reset')}</Button>
                <Button variant="secondary" onClick={onBack}>{t('settings_back')}</Button>
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

            <section className={styles.right}>
              {visibleSettings.map(s => (
                <Card key={s.id} title={t(s.labelKey || s.label || s.id)} className={`${s.implemented===false?styles.disabled:''} ${s.id==='difficulty' || s.id==='skin'?styles.full:''}`}>
                  <div className={styles.cardDesc}>{s.description}</div>
                  <div>
                    {renderControl(s)}
                  </div>
                  {s.implemented === false ? <div style={{marginTop:8}}><small style={{color:'var(--muted)'}}>{t('coming_soon')}</small></div> : null}
                </Card>
              ))}
            </section>
          </div>

          
        </div>
      </div>
    </Layout>
  );
}
