#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const pkgDir = process.cwd();
const srcCss = path.join(pkgDir, 'node_modules', '@fontsource', 'inter', 'variable.css');
const srcFilesDir = path.join(pkgDir, 'node_modules', '@fontsource', 'inter', 'files');
const destDir = path.join(pkgDir, 'public', 'assets', 'fonts');
const outCss = path.join(pkgDir, 'src', 'styles', 'inter-local.css');

function ensureDir(d){ if(!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

if(!fs.existsSync(srcCss)){
  console.error('Could not find @fontsource/inter in node_modules.\nPlease run `npm install` first.');
  process.exitCode = 1;
  process.exit();
}

ensureDir(destDir);

const css = fs.readFileSync(srcCss, 'utf8');
const urlRegex = /url\(['"]?\.\/files\/([^'"\)]+)['"]?\)/g;
let m;
let outCssContent = css;
const copied = [];
while((m = urlRegex.exec(css)) !== null){
  const fname = m[1];
  const srcFile = path.join(srcFilesDir, fname);
  const destFile = path.join(destDir, fname);
  if(fs.existsSync(srcFile)){
    fs.copyFileSync(srcFile, destFile);
    copied.push(fname);
    outCssContent = outCssContent.replace(new RegExp(escapeRegExp(m[0]), 'g'), `url('/assets/fonts/${fname}')`);
  } else {
    console.warn('Missing file in @fontsource package:', fname);
  }
}

fs.writeFileSync(outCss, outCssContent, 'utf8');
console.log('Wrote', outCss);
if(copied.length) console.log('Copied', copied.length, 'font files to', destDir);

function escapeRegExp(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

console.log('Done. Import ./styles/inter-local.css from your styles entry (src/styles/index.ts)');
