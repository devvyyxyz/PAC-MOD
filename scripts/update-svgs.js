const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'public', 'assets', 'icons');

function processFile(file){
  const p = path.join(iconsDir, file);
  let txt = fs.readFileSync(p, 'utf8');
  // remove XML prolog comments (leave header comments intact but strip xml prolog)
  txt = txt.replace(/<\?xml[\s\S]*?\?>/g, '');
  // replace svg root that contains fill="..." and optional width/height
  txt = txt.replace(/<svg([^>]*?)>/i, (m, attrs)=>{
    // keep viewBox if present
    const vbMatch = attrs.match(/viewBox\s*=\s*"([^"]+)"/i);
    const vb = vbMatch ? ` viewBox="${vbMatch[1]}"` : ' viewBox="0 0 16 16"';
    return `<svg width="16" height="16"${vb} xmlns="http://www.w3.org/2000/svg">`;
  });
  // ensure every <path ...> has fill="currentColor" unless it already has fill or stroke attributes
  txt = txt.replace(/<path([^>]*?)\/>/gi, (m, attrs)=>{
    if(/\bfill\s*=/.test(attrs) || /\bstroke\s*=/.test(attrs)) return `<path${attrs}/>`;
    return `<path fill="currentColor"${attrs}/>`;
  });
  // also handle <circle>, <rect>, <polyline>, <polygon>, <g> shapes where appropriate
  txt = txt.replace(/<(circle|rect|ellipse|polygon|polyline)([^>]*?)\/>/gi, (m, tag, attrs)=>{
    if(/\bfill\s*=/.test(attrs) || /\bstroke\s*=/.test(attrs)) return `<${tag}${attrs}/>`;
    return `<${tag} fill="currentColor"${attrs}/>`;
  });
  fs.writeFileSync(p, txt, 'utf8');
  console.log('Updated', file);
}

fs.readdirSync(iconsDir).forEach(f => {
  if(f.toLowerCase().endsWith('.svg')){
    try{ processFile(f); }catch(e){ console.error('Failed', f, e.message); }
  }
});

console.log('SVG update script finished.');
