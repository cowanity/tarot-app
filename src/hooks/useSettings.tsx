import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';
import { browserStorage } from '../lib/browserStorage';
import { FONT_SCALES, SETTINGS_KEY, parseSettings, readSettings, writeSettings, type Settings } from '../lib/settings';
import { useMotionPreference } from '../lib/useMotionPreference';

interface SettingsContextValue {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  saveStatus: 'idle' | 'saved' | 'error';
}
const SettingsContext = createContext<SettingsContextValue | null>(null);
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('SettingsProvider is required');
  return context;
}

function SettingsRuntime({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  const {reduced, level} = useMotionPreference();
  const quiet = reduced || level === 'minimal';
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', String(FONT_SCALES[settings.fontScale]));
    document.documentElement.dataset.motion = quiet ? 'reduced' : 'full';
    document.documentElement.dataset.effects = level;
  }, [settings.fontScale, quiet, level]);
  return <MotionConfig reducedMotion={quiet ? 'always' : 'never'}>{children}</MotionConfig>;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(() => readSettings(browserStorage()));
  const current = useRef(settings);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const updateSettings = useCallback((patch: Partial<Settings>) => {
    const next = parseSettings(JSON.stringify({ ...current.current, ...patch, ...(('motion' in patch||'effects' in patch)?{motionPromptSeen:true}:{}) }));
    current.current = next; setSettings(next);
    setSaveStatus(writeSettings(browserStorage(), next).ok ? 'saved' : 'error');
  }, []);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key !== SETTINGS_KEY && event.key !== null) return;
      const next = readSettings(browserStorage());
      current.current = next; setSettings(next); setSaveStatus('idle');
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  return <SettingsContext.Provider value={{ settings, updateSettings, saveStatus }}>
    <SettingsRuntime>{children}</SettingsRuntime>
  </SettingsContext.Provider>;
}
