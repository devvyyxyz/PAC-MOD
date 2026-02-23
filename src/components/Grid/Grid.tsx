import React from 'react';
import styles from './Grid.module.css';

type ResponsiveCols = { sm?: number; md?: number; lg?: number };

type GridProps = React.PropsWithChildren<{
  columns?: number | ResponsiveCols;
  gap?: number | string;
  className?: string;
  center?: boolean;
  style?: React.CSSProperties;
}>;

export default function Grid({ columns, gap, className, children, center, style }: GridProps){
  const cssVars: React.CSSProperties = {};
  if(typeof columns === 'number') cssVars['--cols' as any] = columns;
  if(typeof columns === 'object'){
    if(columns.sm) cssVars['--cols-sm' as any] = columns.sm;
    if(columns.md) cssVars['--cols-md' as any] = columns.md;
    if(columns.lg) cssVars['--cols-lg' as any] = columns.lg;
  }
  if(gap !== undefined) cssVars['--gap' as any] = typeof gap === 'number' ? `${gap}px` : gap;

  const cls = `${styles.grid} ${center ? styles.center : ''} ${className || ''}`.trim();

  return (
    <div className={cls} style={{ ...style, ...cssVars }}>
      {children}
    </div>
  );
}
