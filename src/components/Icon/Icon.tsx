import React from 'react';
import styles from './Icon.module.css';
import ICONS from '../../config/icons';

type IconName = keyof typeof ICONS;

const svgCache = new Map<string,string>();

export default function Icon({ name, size = 20, className = '', title, onClick }: { name: IconName; size?: number; className?: string; title?: string; onClick?: () => void }){
  const cls = `${styles.icon} icon ${onClick ? styles.clickable : ''} ${className}`.trim();
  const cfg = (ICONS as any)[name] || { src: `/assets/icons/${name}.svg` };
  const src = cfg.src || `/assets/icons/${name}.svg`;
  const style: React.CSSProperties = {};
  // expose colors as CSS variables so hover styles in parent can override them
  if(cfg.color) (style as any)['--icon-color'] = cfg.color;
  if((cfg as any).hoverColor) (style as any)['--icon-hover-color'] = (cfg as any).hoverColor;

  const [svg, setSvg] = React.useState<string | null>(() => svgCache.get(src) || null);

  React.useEffect(()=>{
    if(!src.endsWith('.svg')) return;
    if(svgCache.has(src)){
      setSvg(svgCache.get(src) || null);
      return;
    }
    let cancelled = false;
    fetch(src).then(r => r.text()).then(text => {
      if(cancelled) return;
      // strip XML prolog/comments to keep markup clean
      let cleaned = text.replace(/<\?xml[\s\S]*?\?>/g, '').replace(/<!--([\s\S]*?)-->/g, '');
      svgCache.set(src, cleaned);
      setSvg(cleaned);
    }).catch(()=>{});
    return ()=>{ cancelled = true; };
  },[src]);

  if(svg){
    // render inlined SVG so `currentColor` works reliably
    return (
      <span className={cls} onClick={onClick} aria-label={title} title={title} style={{...style, width: size, height: size}} dangerouslySetInnerHTML={{__html: svg}} />
    );
  }

  // fallback to img while SVG is loading or if it's not an SVG
  return (
    <img src={src} width={size} height={size} className={cls} onClick={onClick} aria-label={title} alt={title || name} style={style} />
  );
}
