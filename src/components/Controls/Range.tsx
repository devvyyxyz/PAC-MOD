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
  const pct = Math.round(((Number(value) - Number(min)) / (Number(max) - Number(min))) * 100);
  const trackBg = `linear-gradient(90deg, var(--accent) 0%, var(--accent) ${pct}%, rgba(255,255,255,0.08) ${pct}%, rgba(255,255,255,0.08) 100%)`;
  return (
    <div className={styles.wrap}>
      <input
        className={styles.range}
        type="range"
        min={String(min)}
        max={String(max)}
        step={String(step)}
        value={value}
        onChange={(e)=>onChange(parseInt(e.target.value))}
        disabled={disabled}
        style={{ background: trackBg }}
      />
      <div style={{minWidth:48,textAlign:'right'}}>{value}%</div>
      {saved ? <div className={styles.saved}>Saved</div> : null}
    </div>
  );
}
