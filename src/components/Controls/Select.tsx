import React from 'react';
import styles from './Controls.module.css';
import { useI18n } from '..';
import Icon from '../Icon/Icon';

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
        <Icon name="chevron" className={styles.chevron} size={18} aria-hidden={true} />
      </div>
      {saved ? <div className={styles.saved}>{t('settings_saved') || 'Saved'}</div> : null}
    </div>
  );
}
