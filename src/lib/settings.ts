import {initialFxLevel} from './fxEngine';
export const SETTINGS_KEY = 'tarot.settings.v1';
export type EffectLevel = 'full' | 'medium' | 'minimal';
export const deviceEffectDefault = (): EffectLevel => 'full';
export interface Settings {
  schemaVersion: 2;
  sensorTilt: boolean;
  motionPromptSeen: boolean;
  detail: 'full' | 'summary';
  effects: EffectLevel;
  motion: 'system' | 'reduced' | 'full';
  fontScale: 'small' | 'medium' | 'large';
  allowReversedDefault: boolean;
  autoSave: boolean;
  autoInterpret: boolean;
}
export const DEFAULT_SETTINGS: Readonly<Settings> = {
  schemaVersion: 2, sensorTilt:false, motionPromptSeen: false, detail: 'full', effects: 'full', motion: 'full', fontScale: 'medium', allowReversedDefault: false, autoSave: false, autoInterpret: true,
};
export const FONT_SCALES = { small: 0.92, medium: 1, large: 1.12 } as const;

export function parseSettings(raw: string | null): Settings {
  try {
    const value: unknown = JSON.parse(raw ?? 'null');
    if (!value || typeof value !== 'object' || Array.isArray(value)) return { ...DEFAULT_SETTINGS };
    const object = value as Record<string, unknown>;
    const current=object.schemaVersion===2;
    // Previous shipped code defaulted to system/mobile-medium; reduced/minimal required a choice.
    const legacyOff=!current&&(object.motion==='reduced'||object.effects==='minimal');
    return {
      schemaVersion:2, sensorTilt:object.sensorTilt===true, motionPromptSeen:legacyOff||(current&&object.motionPromptSeen===true), detail:object.detail==='summary'?'summary':'full',
      effects: !current ? (legacyOff?'minimal':'full') : object.effects === 'full' || object.effects === 'medium' || object.effects === 'minimal' ? object.effects : deviceEffectDefault(),
      motion: !current ? (legacyOff?'reduced':'full') : object.motion === 'reduced' || object.motion === 'full' || object.motion === 'system' ? object.motion : 'full',
      fontScale: object.fontScale === 'small' || object.fontScale === 'large' || object.fontScale === 'medium' ? object.fontScale : 'medium',
      allowReversedDefault: typeof object.allowReversedDefault === 'boolean' ? object.allowReversedDefault : false,
      autoInterpret: typeof object.autoInterpret === 'boolean' ? object.autoInterpret : true,
      autoSave: typeof object.autoSave === 'boolean' ? object.autoSave : false,
    };
  } catch { return { ...DEFAULT_SETTINGS }; }
}

export function readSettings(storage: Storage | null): Settings {
  try { const raw=storage?.getItem(SETTINGS_KEY)??null;const next=parseSettings(raw);if(!raw&&typeof navigator!=='undefined')next.effects=initialFxLevel(navigator.hardwareConcurrency,(navigator as Navigator&{deviceMemory?:number}).deviceMemory);if(raw&&JSON.parse(raw)?.schemaVersion!==2)writeSettings(storage,next);return next; }
  catch { return { ...DEFAULT_SETTINGS }; }
}
export function writeSettings(storage: Storage | null, settings: Settings): { ok: boolean } {
  try {
    if (!storage) return { ok: false };
    storage.setItem(SETTINGS_KEY, JSON.stringify(parseSettings(JSON.stringify(settings))));
    return { ok: true };
  } catch { return { ok: false }; }
}
