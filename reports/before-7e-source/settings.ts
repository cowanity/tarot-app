export const SETTINGS_KEY = 'tarot.settings.v1';
export type EffectLevel = 'full' | 'medium' | 'minimal';
export const deviceEffectDefault = (): EffectLevel => typeof window !== 'undefined' && window.matchMedia?.('(max-width: 767px), (pointer: coarse)').matches ? 'medium' : 'full';
export interface Settings {
  effects: EffectLevel;
  motion: 'system' | 'reduced' | 'full';
  fontScale: 'small' | 'medium' | 'large';
  allowReversedDefault: boolean;
  autoSave: boolean;
  autoInterpret: boolean;
}
export const DEFAULT_SETTINGS: Readonly<Settings> = {
  effects: deviceEffectDefault(), motion: 'system', fontScale: 'medium', allowReversedDefault: false, autoSave: false, autoInterpret: true,
};
export const FONT_SCALES = { small: 0.92, medium: 1, large: 1.12 } as const;

export function parseSettings(raw: string | null): Settings {
  try {
    const value: unknown = JSON.parse(raw ?? 'null');
    if (!value || typeof value !== 'object' || Array.isArray(value)) return { ...DEFAULT_SETTINGS };
    const object = value as Record<string, unknown>;
    return {
      effects: object.effects === 'full' || object.effects === 'medium' || object.effects === 'minimal' ? object.effects : deviceEffectDefault(),
      motion: object.motion === 'reduced' || object.motion === 'full' || object.motion === 'system' ? object.motion : 'system',
      fontScale: object.fontScale === 'small' || object.fontScale === 'large' || object.fontScale === 'medium' ? object.fontScale : 'medium',
      allowReversedDefault: typeof object.allowReversedDefault === 'boolean' ? object.allowReversedDefault : false,
      autoInterpret: typeof object.autoInterpret === 'boolean' ? object.autoInterpret : true,
      autoSave: typeof object.autoSave === 'boolean' ? object.autoSave : false,
    };
  } catch { return { ...DEFAULT_SETTINGS }; }
}

export function readSettings(storage: Storage | null): Settings {
  try { return parseSettings(storage?.getItem(SETTINGS_KEY) ?? null); }
  catch { return { ...DEFAULT_SETTINGS }; }
}
export function writeSettings(storage: Storage | null, settings: Settings): { ok: boolean } {
  try {
    if (!storage) return { ok: false };
    storage.setItem(SETTINGS_KEY, JSON.stringify(parseSettings(JSON.stringify(settings))));
    return { ok: true };
  } catch { return { ok: false }; }
}
