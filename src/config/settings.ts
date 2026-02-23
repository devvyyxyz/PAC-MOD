export type SettingType = 'toggle' | 'select' | 'button' | 'range' | 'number';

export type SettingMeta = {
  id: string;
  label?: string;
  labelKey?: string;
  type: SettingType;
  implemented?: boolean; // if false, will be greyed out
  description?: string;
  options?: string[]; // for select
}

const SETTINGS: SettingMeta[] = [
  { id: 'sound', labelKey: 'setting_sound', type: 'toggle', implemented: true, description: 'Enable in-game sound effects' },
  { id: 'music', labelKey: 'setting_music', type: 'toggle', implemented: true, description: 'Toggle background music' },
  { id: 'difficulty', labelKey: 'setting_difficulty', type: 'select', implemented: true, options: ['easy','normal','hard'], description: 'AI and game speed' },
  { id: 'skin', labelKey: 'setting_skin', type: 'select', implemented: true, options: ['classic','neon','ghost'], description: 'Player skin selection' },
  { id: 'volume', labelKey: 'setting_volume', type: 'range', implemented: true, description: 'Master volume level' },
  { id: 'maxLives', labelKey: 'setting_maxLives', type: 'number', implemented: true, description: 'Starting extra lives' },
  { id: 'highContrast', label: 'High Contrast Mode', type: 'toggle', implemented: false, description: 'Experimental accessibility mode (coming soon)' },
  { id: 'onlineLeaderboard', label: 'Online Leaderboards', type: 'toggle', implemented: false, description: 'Upload scores to global leaderboard (not yet implemented)' }
  ,{ id: 'locale', labelKey: 'setting_language', type: 'select', implemented: true, options: ['en','es','pl'], description: 'UI Language' }
];

export default SETTINGS;
