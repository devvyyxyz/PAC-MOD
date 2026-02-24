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

// Additional proposed settings (kept unimplemented for now)
SETTINGS.push(
  { id: 'vsync', labelKey: 'setting_vsync', category: 'display', type: 'toggle', implemented: false, description: 'Enable vertical sync (coming soon)' },
  { id: 'resolution', labelKey: 'setting_resolution', category: 'display', type: 'select', implemented: false, options: ['800x600','1024x768','1280x720','1920x1080'], description: 'Render resolution (coming soon)' },
  { id: 'fpsCap', labelKey: 'setting_fpsCap', category: 'display', type: 'number', implemented: false, description: 'Cap the framerate (coming soon)' },
  { id: 'textureQuality', labelKey: 'setting_textureQuality', category: 'display', type: 'select', implemented: false, options: ['low','medium','high'], description: 'Texture quality (coming soon)' },
  { id: 'shadowQuality', labelKey: 'setting_shadowQuality', category: 'display', type: 'select', implemented: false, options: ['off','low','high'], description: 'Shadow quality (coming soon)' },
  { id: 'bloom', labelKey: 'setting_bloom', category: 'display', type: 'toggle', implemented: false, description: 'Bloom post-processing (coming soon)' },
  { id: 'particleDensity', labelKey: 'setting_particleDensity', category: 'display', type: 'range', implemented: false, description: 'Particle density (coming soon)' },
  { id: 'showHitboxes', labelKey: 'setting_showHitboxes', category: 'developer', type: 'toggle', implemented: false, description: 'Render hitboxes for debugging (coming soon)' },
  { id: 'autoRestart', labelKey: 'setting_autoRestart', category: 'gameplay', type: 'toggle', implemented: false, description: 'Auto-restart level on failure (coming soon)' },
  { id: 'autoSave', labelKey: 'setting_autoSave', category: 'general', type: 'toggle', implemented: false, description: 'Automatically save progress (coming soon)' },
  { id: 'saveInterval', labelKey: 'setting_saveInterval', category: 'general', type: 'number', implemented: false, description: 'Auto-save interval in minutes (coming soon)' },
  { id: 'notifications', labelKey: 'setting_notifications', category: 'general', type: 'toggle', implemented: false, description: 'Show in-game notifications (coming soon)' },
  { id: 'voiceChat', labelKey: 'setting_voiceChat', category: 'online', type: 'toggle', implemented: false, description: 'Enable voice chat (coming soon)' },
  { id: 'networkMode', labelKey: 'setting_networkMode', category: 'online', type: 'select', implemented: false, options: ['offline','online'], description: 'Network mode (coming soon)' },
  { id: 'matchmakingRegion', labelKey: 'setting_matchmakingRegion', category: 'online', type: 'select', implemented: false, options: ['auto','eu','na','asia'], description: 'Matchmaking region (coming soon)' },
  { id: 'subtitles', labelKey: 'setting_subtitles', category: 'accessibility', type: 'toggle', implemented: false, description: 'Show subtitles for game messages (coming soon)' },
  { id: 'uiAnimations', labelKey: 'setting_uiAnimations', category: 'general', type: 'toggle', implemented: false, description: 'Enable UI animations (coming soon)' },
  { id: 'logLevel', labelKey: 'setting_logLevel', category: 'developer', type: 'select', implemented: false, options: ['info','warn','error','debug'], description: 'Logging verbosity (coming soon)' },
  { id: 'developerMode', labelKey: 'setting_developerMode', category: 'developer', type: 'toggle', implemented: false, description: 'Enable developer features (coming soon)' },
  { id: 'experimentalFeatures', labelKey: 'setting_experimentalFeatures', category: 'general', type: 'toggle', implemented: false, description: 'Enable experimental features (coming soon)' },
  { id: 'physicsAccuracy', labelKey: 'setting_physicsAccuracy', category: 'gameplay', type: 'select', implemented: false, options: ['low','normal','high'], description: 'Physics simulation accuracy (coming soon)' },
  { id: 'adaptiveDifficulty', labelKey: 'setting_adaptiveDifficulty', category: 'gameplay', type: 'toggle', implemented: false, description: 'Adaptive difficulty (coming soon)' },
  { id: 'assistMode', labelKey: 'setting_assistMode', category: 'accessibility', type: 'select', implemented: false, options: ['off','partial','full'], description: 'Assist features for accessibility (coming soon)' },
  { id: 'tutorialHints', labelKey: 'setting_tutorialHints', category: 'general', type: 'toggle', implemented: false, description: 'Show tutorial hints (coming soon)' },
  { id: 'controllerLayout', labelKey: 'setting_controllerLayout', category: 'controls', type: 'select', implemented: false, options: ['auto','xbox','ps','nintendo'], description: 'Preferred controller layout (coming soon)' },
  { id: 'touchControls', labelKey: 'setting_touchControls', category: 'controls', type: 'toggle', implemented: false, description: 'Enable touch-friendly controls (coming soon)' },
  { id: 'vibrationIntensity', labelKey: 'setting_vibrationIntensity', category: 'controls', type: 'range', implemented: false, description: 'Controller vibration intensity (coming soon)' },
  { id: 'brightness', labelKey: 'setting_brightness', category: 'display', type: 'range', implemented: false, description: 'Screen brightness (coming soon)' },
  { id: 'contrast', labelKey: 'setting_contrast', category: 'display', type: 'range', implemented: false, description: 'Screen contrast (coming soon)' },
  { id: 'gamma', labelKey: 'setting_gamma', category: 'display', type: 'range', implemented: false, description: 'Gamma correction (coming soon)' }
);

export default SETTINGS;
