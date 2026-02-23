import React from 'react';
import styles from './Controls.module.css';

type Props = {
  value: number;
  onChange: (n:number)=>void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  saved?: boolean;
};

export default function Range({value,onChange,min=0,max=100,step=1,disabled,saved}:Props){
  return (
    <div className={styles.wrap}>
      <input className={styles.range} type="range" min={String(min)} max={String(max)} step={String(step)} value={value} onChange={(e)=>onChange(parseInt(e.target.value))} disabled={disabled} />
      <div style={{minWidth:48,textAlign:'right'}}>{value}%</div>
      {saved ? <div className={styles.saved}>Saved</div> : null}
    </div>
  );
}
