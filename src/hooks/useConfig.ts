import { useState, useEffect, useCallback } from 'react';
import config from '../config';

type AnyObj = Record<string, any>;

export function useConfig() {
  const [cfg, setCfg] = useState<AnyObj>(() => config.loadConfig());

  useEffect(() => {
    setCfg(config.loadConfig());
  }, []);

  const saveConfig = useCallback((patch: AnyObj) => {
    const next = { ...cfg, ...patch };
    setCfg(next);
    try { config.saveConfig(next); } catch {}
  }, [cfg]);

  const setConfig = useCallback((next: AnyObj) => {
    setCfg(next);
    try { config.saveConfig(next); } catch {}
  }, []);

  const reload = useCallback(() => setCfg(config.loadConfig()), []);

  return { config: cfg, saveConfig, setConfig, reload };
}
