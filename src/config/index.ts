import { DEFAULT_CONFIG, AppConfig } from './defaults';

const STORAGE_KEY = 'pacman.config.v1';

export function loadConfig(): AppConfig {
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      return {...DEFAULT_CONFIG, ...JSON.parse(raw)} as AppConfig;
    }
  }catch(e){
    // ignore parse errors and fall back to defaults
  }
  return DEFAULT_CONFIG;
}

export function saveConfig(cfg: Partial<AppConfig>){
  try{
    const existing = loadConfig();
    const merged = {...existing, ...cfg};
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    try{
      // notify other parts of the app about config changes
      const ev = new CustomEvent('pacman.config.changed', { detail: merged });
      window.dispatchEvent(ev);
    }catch(e){}
    return merged;
  }catch(e){
    console.error('Failed to save config', e);
    return loadConfig();
  }
}

export function getDiscordWebhook(): string | null {
  // prefer Vite-provided env var
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const env = (import.meta as any).env as Record<string,string|undefined>;
  if(env && env.VITE_DISCORD_WEBHOOK_URL) {
    const v = String(env.VITE_DISCORD_WEBHOOK_URL).trim();
    if(v) return v;
  }
  // fallback to stored config value
  const cfg = loadConfig();
  if(cfg && cfg.discordWebhook) return String(cfg.discordWebhook);
  // finally fall back to the hard-coded default in source
  if(DEFAULT_CONFIG && DEFAULT_CONFIG.discordWebhook) return String(DEFAULT_CONFIG.discordWebhook);
  return null;
}

export default { loadConfig, saveConfig, getDiscordWebhook };
