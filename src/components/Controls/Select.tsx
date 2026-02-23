import React from 'react';
import styles from './Controls.module.css';

type Props = {
  value: string;
  onChange: (v:string)=>void;
  options: string[];
  disabled?: boolean;
  saved?: boolean;
};

export default function Select({value,onChange,options,disabled,saved}:Props){
  return (
    <div className={styles.wrap}>
      <select className={styles.select} value={value} onChange={(e)=>onChange(e.target.value)} disabled={disabled}>
        {options.map(o=> <option key={o} value={o}>{o}</option>)}
      </select>
      {saved ? <div className={styles.saved}>Saved</div> : null}
    </div>
  );
}
