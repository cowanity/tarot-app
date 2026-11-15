import type { Card } from '../types';
import type { EffectLevel } from './settings';
export type Point = {x: number; y: number};
export type BurstKind = 'major' | 'fire' | 'water' | 'air' | 'earth' | 'gold' | 'cold';
export function dockLift(distance: number, radius = 180, maximum = 38) {
  if (!Number.isFinite(distance) || radius <= 0) return 0;
  const t = Math.max(0, 1 - Math.abs(distance) / radius);
  return maximum * t * t * (3 - 2 * t);
}
export function throwPoint(from: Point, to: Point, t: number): Point {
  const height = Math.min(180, Math.max(45, Math.hypot(to.x-from.x, to.y-from.y) * .22));
  return {x: from.x + (to.x-from.x)*t, y: from.y + (to.y-from.y)*t - 4*height*t*(1-t)};
}
export const particleAllowance = (live: number, requested: number, cap = 160) =>
  Number.isFinite(requested) ? Math.max(0, Math.min(Math.floor(requested), Math.min(160, Math.max(0, cap)) - Math.max(0, live))) : 0;
export function burstKind(card: Pick<Card, 'arcana' | 'element' | 'suit'>): BurstKind {
  if (card.arcana === 'major') return 'major';
  return ({'Lửa': 'fire', 'Nước': 'water', 'Khí': 'air', 'Đất': 'earth'} as const)[card.element!]
    ?? ({wands: 'fire', cups: 'water', swords: 'air', pentacles: 'earth'} as const)[card.suit!] ?? 'gold';
}
export function effectParams(level: EffectLevel, reduced: boolean, mobile: boolean) {
  const quiet = reduced || level === 'minimal';
  return {cap: quiet ? 0 : mobile ? (level === 'full' ? 40 : 24) : level === 'full' ? 160 : 80,
    burst: quiet ? 0 : mobile ? 16 : level === 'full' ? 64 : 28,
    tilt: !quiet && !mobile && level === 'full', aurora: !quiet, chargeMs: quiet ? 0 : 450};
}
export function adaptParticleCap(cap: number, elapsedMs: number, frames: number) {
  return cap > 8 && elapsedMs >= 1000 && frames * 1000 / elapsedMs < 40 ? Math.max(8, Math.floor(cap * .65)) : cap;
}
