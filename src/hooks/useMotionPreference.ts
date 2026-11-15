import { useMotionPreference as usePreference } from '../lib/useMotionPreference';
/** Compatibility adapter: all existing animations share the same preference source. */
export function useMotionPreference(): boolean {
  const {reduced, level} = usePreference();
  return reduced || level === 'minimal';
}
