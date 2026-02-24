import React from 'react';
import styles from './Controls.module.css';
import { useI18n } from '..';

type Props = {
  value: string;
  onChange: (v:string)=>void;
  options: string[];
  disabled?: boolean;
  saved?: boolean;
};

export default function Select({value,onChange,options,disabled,saved}:Props){
  const { t } = useI18n();
  return (
    <div className={styles.wrap}>
      <div className={styles.selectWrap}>
        <select className={styles.select} value={value} onChange={(e)=>onChange(e.target.value)} disabled={disabled}>
          {options.map(o=> <option key={o} value={o}>{t(o)}</option>)}
        </select>
        <span className={styles.chevron} aria-hidden>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {saved ? <div className={styles.saved}>{t('settings_saved') || 'Saved'}</div> : null}
    </div>
  );
}
