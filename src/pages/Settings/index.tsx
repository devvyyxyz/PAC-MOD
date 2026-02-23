import React, {useEffect, useState} from 'react';
import menuStyles from '../../components/Menu/Menu.module.css';
import Button from '../../components/Button';
import styles from './Settings.module.css';
import SETTINGS, { SettingMeta } from '../../config/settings';
import config from '../../config';
import { useI18n, Layout, Grid } from '../../components';
import { Toggle, Select, Range, NumberInput } from '../../components/Controls';
import Card from '../../components/Card/Card';
import { DEFAULT_CONFIG } from '../../config/defaults';

type LocalSettings = Record<string, any>;

export default function Settings({onBack}:{onBack:()=>void}){
  const [local, setLocal] = useState<LocalSettings>({});
  const [applied, setApplied] = useState(false);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const { t, setLocale } = useI18n();

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
    setApplied(true);
    setTimeout(()=>setApplied(false), 2000);
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

  return (
    <Layout title={t('settings_title')} subtitle={t('settings_subtitle')} sticky>
      <div className={styles.wrap}>
        <div className={styles.stage}>

          <Grid columns={{sm:1,md:2,lg:3}} gap={12} className={styles.grid}>
            {SETTINGS.map(s => (
              <Card key={s.id} title={t(s.labelKey || s.label || s.id)} className={`${s.implemented===false?styles.disabled:''} ${s.id==='difficulty' || s.id==='skin'?styles.full:''}`}>
                <div className={styles.cardDesc}>{s.description}</div>
                <div>
                  {renderControl(s)}
                </div>
                {s.implemented === false ? <div style={{marginTop:8}}><small style={{color:'var(--muted)'}}>{t('coming_soon')}</small></div> : null}
              </Card>
            ))}
          </Grid>

          <div style={{marginTop:16,display:'flex',gap:8,justifyContent:'center',alignItems:'center'}}>
            <Button variant="primary" onClick={handleApply}>{t('settings_apply')}</Button>
            <Button variant="secondary" onClick={handleReset}>{t('settings_reset')}</Button>
            <Button variant="secondary" onClick={onBack}>{t('settings_back')}</Button>
            {applied && <div style={{marginLeft:8,color:'var(--accent)',fontWeight:600}}>{t('settings_applied')}</div>}
          </div>
        </div>
      </div>
    </Layout>
  );
}
