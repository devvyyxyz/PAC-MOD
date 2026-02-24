import AUDIO from '../config/audio';
import config from '../config';

function playOscillator() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.value = 420;
    g.gain.value = 0.0001;
    o.connect(g);
    g.connect(ctx.destination);
    const now = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
    o.start(now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    o.stop(now + 0.17);
  } catch (e) {
    // ignore
  }
}

export function playSfx(name?: string){
  try{
    // respect persisted volume setting (0-100) if present
    const cfg = config.loadConfig();
    const vol = (typeof cfg.settings?.volume === 'number') ? (cfg.settings.volume / 100) : 1;
    if(name && (AUDIO as any)[name]){
      const entry = (AUDIO as any)[name];
      try{
        const a = new Audio(encodeURI(entry.src));
        a.volume = typeof entry.defaultVolume === 'number' ? (entry.defaultVolume * vol) : vol;
        if(entry.loop) a.loop = true;
        a.play().catch(()=>{});
        return;
      }catch(e){}
    }
    // fallback to oscillator-based click if no audio entry exists
    playOscillator();
  }catch(e){ playOscillator(); }
}

// legacy helper kept for compatibility; prefer playSfx(name)
export function playChomp(){ playSfx('sfxChomp'); }

let _bgMusic: HTMLAudioElement | null = null;
export function playMusic(name: string){
  try{
    const entry = (AUDIO as any)[name];
    if(!entry) return null;
    if(_bgMusic){ try{ _bgMusic.pause(); _bgMusic.src = ''; }catch(e){} }
    const cfg = config.loadConfig();
    const vol = (typeof cfg.settings?.volume === 'number') ? (cfg.settings.volume / 100) : 1;
    const a = new Audio(encodeURI(entry.src));
    a.loop = !!entry.loop;
    a.volume = typeof entry.defaultVolume === 'number' ? (entry.defaultVolume * vol) : vol;
    _bgMusic = a;
    a.play().catch(()=>{});
    return a;
  }catch(e){ return null; }
}

export function stopMusic(){
  try{
    if(_bgMusic){ _bgMusic.pause(); _bgMusic.src = ''; _bgMusic = null; }
  }catch(e){}
}
