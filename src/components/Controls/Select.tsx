import React from 'react';
import styles from './Controls.module.css';
import { useI18n } from '..';
import Icon from '../Icon/Icon';

type OptionItem = string | { value: string; label: string };

type Props = {
  value: string;
  onChange: (v:string)=>void;
  options: OptionItem[];
  disabled?: boolean;
  saved?: boolean;
};

export default function Select({value,onChange,options,disabled,saved}:Props){
  const { t } = useI18n();
  return (
    <div className={styles.wrap}>
      <div className={styles.selectWrap}>
        <select className={styles.select} value={value} onChange={(e)=>onChange(e.target.value)} disabled={disabled}>
          {options.map(o=> {
            const val = typeof o === 'string' ? o : o.value;
            const label = typeof o === 'string' ? t(o) : o.label;
            return <option key={val} value={val}>{label}</option>;
          })}
        </select>
        <Icon name="chevron" className={styles.chevron} size={18} aria-hidden={true} />
      </div>
      {saved ? <div className={styles.saved}>{t('settings_saved') || 'Saved'}</div> : null}
    </div>
  );
}
