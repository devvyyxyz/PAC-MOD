#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function read(file){ return fs.readFileSync(path.join(__dirname,'..',file),'utf8'); }

const settingsSrc = read('src/config/settings.ts');
const defaultsSrc = read('src/config/defaults.ts');

// extract setting ids from SETTINGS array: look for { id: 'name', ... }
const idRegex = /\{[^}]*id:\s*'([a-zA-Z0-9_]+)'/g;
const ids = [];
let m;
while((m = idRegex.exec(settingsSrc))){ ids.push(m[1]); }

// extract keys from DEFAULT_CONFIG.settings = { key: ... }
const defaultsSection = defaultsSrc.split('settings:')[1];
if(!defaultsSection){ console.error('failed to find DEFAULT_CONFIG.settings'); process.exit(2); }
const defaultsBody = defaultsSection.split('},')[0];
const keyRegex = /([a-zA-Z0-9_]+)\s*:/g;
const keys = [];
while((m = keyRegex.exec(defaultsBody))){ keys.push(m[1]); }

const missing = ids.filter(id => !keys.includes(id));
if(missing.length){
  console.error('Missing defaults for settings ids:', missing.join(', '));
  process.exit(1);
}
console.log('All settings have defaults.');
process.exit(0);
