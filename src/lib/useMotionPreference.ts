import { useReducedMotion } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';
import type { EffectLevel, Settings } from './settings';
export function resolveMotionPreference(settings: Pick<Settings, 'motion' | 'effects'>, systemReduced: boolean): {level: EffectLevel; reduced: boolean} {
  const reduced = settings.motion === 'reduced' || (settings.motion === 'system' && systemReduced);
  return {level: reduced ? 'minimal' : settings.effects, reduced};
}
/** Full by default; the explicit in-app choice takes precedence. */
export function useMotionPreference() {
  const systemReduced = useReducedMotion();
  const {settings} = useSettings();
  return resolveMotionPreference(settings, Boolean(systemReduced));
}
