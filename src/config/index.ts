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
  if(env && env.VITE_DISCORD_WEBHOOK_URL) return String(env.VITE_DISCORD_WEBHOOK_URL);
  // fallback to stored config value
  const cfg = loadConfig();
  return cfg.discordWebhook || null;
}

export default { loadConfig, saveConfig, getDiscordWebhook };
