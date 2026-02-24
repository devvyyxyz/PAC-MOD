export type SettingType = 'toggle' | 'select' | 'button' | 'range' | 'number';

export type SettingMeta = {
  id: string;
  label?: string;
  labelKey?: string;
  category?: string;
  type: SettingType;
  implemented?: boolean; // if false, will be greyed out
  description?: string;
  options?: string[]; // for select
}

const SETTINGS: SettingMeta[] = [
  { id: 'sound', labelKey: 'setting_sound', category: 'audio', type: 'toggle', implemented: true, description: 'Enable in-game sound effects' },
  { id: 'music', labelKey: 'setting_music', category: 'audio', type: 'toggle', implemented: true, description: 'Toggle background music' },
  { id: 'difficulty', labelKey: 'setting_difficulty', category: 'gameplay', type: 'select', implemented: true, options: ['easy','normal','hard'], description: 'AI and game speed' },
  { id: 'skin', labelKey: 'setting_skin', category: 'gameplay', type: 'select', implemented: true, options: ['classic','neon','ghost'], description: 'Player skin selection' },
  { id: 'volume', labelKey: 'setting_volume', category: 'audio', type: 'range', implemented: true, description: 'Master volume level' },
  { id: 'maxLives', labelKey: 'setting_maxLives', category: 'gameplay', type: 'number', implemented: true, description: 'Starting extra lives' },
  { id: 'invertControls', labelKey: 'setting_invertControls', category: 'controls', type: 'toggle', implemented: false, description: 'Invert left/right controls' },
  { id: 'showFPS', labelKey: 'setting_showFPS', category: 'gameplay', type: 'toggle', implemented: false, description: 'Show FPS counter in top corner' },
  { id: 'controlScheme', labelKey: 'setting_controlScheme', category: 'controls', type: 'select', implemented: true, options: ['arrow','wasd'], description: 'Preferred control layout' },
  { id: 'colorBlindMode', labelKey: 'setting_colorBlindMode', category: 'accessibility', type: 'select', implemented: false, options: ['none','protanopia','deuteranopia'], description: 'Color-blind accessibility mode' },
  { id: 'keyboardNavigation', labelKey: 'setting_keyboardNavigation', category: 'controls', type: 'toggle', implemented: true, description: 'Enable keyboard navigation in menus' },
  { id: 'mouseNavigation', labelKey: 'setting_mouseNavigation', category: 'controls', type: 'toggle', implemented: false, description: 'Enable mouse navigation in menus' },
  { id: 'mouseSensitivity', labelKey: 'setting_mouseSensitivity', category: 'controls', type: 'range', implemented: false, description: 'Mouse sensitivity for menu interactions' },
  { id: 'highContrast', labelKey: 'setting_highContrast', category: 'accessibility', type: 'toggle', implemented: false, description: 'Experimental accessibility mode (coming soon)' },
  { id: 'onlineLeaderboard', labelKey: 'setting_onlineLeaderboard', category: 'online', type: 'toggle', implemented: false, description: 'Upload scores to global leaderboard (not yet implemented)' },
  { id: 'locale', labelKey: 'setting_language', category: 'general', type: 'select', implemented: true, options: ['en','es','pl'], description: 'UI Language' }
  ,
  { id: 'retroFilter', labelKey: 'setting_retroFilter', category: 'display', type: 'toggle', implemented: false, description: 'CRT-style scanlines and blur (coming soon)' },
  { id: 'particleEffects', labelKey: 'setting_particleEffects', category: 'display', type: 'toggle', implemented: false, description: 'Toggle particle effects in gameplay (coming soon)' },
  { id: 'controllerRumble', labelKey: 'setting_controllerRumble', category: 'controls', type: 'toggle', implemented: false, description: 'Enable vibration for controllers (coming soon)' },
  { id: 'cloudSaves', labelKey: 'setting_cloudSaves', category: 'online', type: 'toggle', implemented: false, description: 'Save progress to cloud (coming soon)' },
  { id: 'autoPause', labelKey: 'setting_autoPause', category: 'gameplay', type: 'toggle', implemented: false, description: 'Automatically pause when unfocused (coming soon)' },
  { id: 'advancedGraphics', labelKey: 'setting_advancedGraphics', category: 'display', type: 'toggle', implemented: false, description: 'Advanced rendering features (coming soon)' }
];

export default SETTINGS;
