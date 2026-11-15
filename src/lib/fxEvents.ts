import type { BurstKind, Point } from './fxMath';
export type FxEvent = {type: 'burst'; x: number; y: number; kind: BurstKind; count: number} | {type: 'trail'; from: Point; to: Point};
const listeners = new Set<(event: FxEvent) => void>();
export const burst = (value: Omit<Extract<FxEvent, {type:'burst'}>, 'type'>) => listeners.forEach(fn => fn({type:'burst', ...value}));
export const trail = (from: Point, to: Point) => listeners.forEach(fn => fn({type: 'trail', from, to}));
export function subscribeFx(fn: (event: FxEvent) => void) { listeners.add(fn); return () => {listeners.delete(fn);}; }
