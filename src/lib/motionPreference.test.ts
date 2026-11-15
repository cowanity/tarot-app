import {describe, expect, test} from 'vitest';
import {resolveMotionPreference} from './useMotionPreference';
import {DEFAULT_SETTINGS, parseSettings} from './settings';
describe('shared motion preference', () => {
  test.each(['full', 'medium', 'minimal'] as const)('effect level %s respects explicit choice and system default', effects => {
    expect(resolveMotionPreference({motion: 'full', effects}, true)).toEqual({level: effects, reduced: false});
    expect(resolveMotionPreference({motion: 'system', effects}, true)).toEqual({level: 'minimal', reduced: true});
    expect(resolveMotionPreference({motion: 'reduced', effects}, true)).toEqual({level: 'minimal', reduced: true});
    expect(resolveMotionPreference({motion: 'reduced', effects}, false)).toEqual({level: 'minimal', reduced: true});
    expect(resolveMotionPreference({motion: 'system', effects}, false)).toEqual({level: effects, reduced: false});
  });
  test('old settings and invalid effect levels retain device defaults', () => {
    expect(parseSettings('{}').effects).toBe(DEFAULT_SETTINGS.effects);
    expect(parseSettings('{"effects":"unknown"}').effects).toBe(DEFAULT_SETTINGS.effects);
    expect(parseSettings('{"effects":"minimal"}').effects).toBe('minimal');
  });
});
