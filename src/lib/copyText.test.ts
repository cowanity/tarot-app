import {afterEach, expect, test, vi} from 'vitest';
import {copyText} from './copyText';
afterEach(() => vi.unstubAllGlobals());
function fallback(ok = true) {
  const textarea = {value: '', readOnly: false, tabIndex: 0, style: {cssText: ''}, focus: vi.fn(), select: vi.fn(), setSelectionRange: vi.fn(), remove: vi.fn()};
  const document = {activeElement: {focus: vi.fn()}, createElement: vi.fn(() => textarea), body: {appendChild: vi.fn()}, execCommand: vi.fn(() => ok)};
  vi.stubGlobal('document', document);
  return {textarea, document};
}
test('native clipboard succeeds without touching the DOM', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal('navigator', {clipboard: {writeText}});
  vi.stubGlobal('document', undefined);
  expect(await copyText('Xin chào')).toBe(true);
  expect(writeText).toHaveBeenCalledWith('Xin chào');
});
test.each([false, true])('fallback copies and cleans up when clipboard missing/rejected: %s', async rejected => {
  vi.stubGlobal('navigator', rejected ? {clipboard: {writeText: vi.fn().mockRejectedValue(new Error('denied'))}} : {});
  const {textarea, document} = fallback();
  expect(await copyText('Đủ dấu')).toBe(true);
  expect(textarea.value).toBe('Đủ dấu');
  expect(document.execCommand).toHaveBeenCalledWith('copy');
  expect(textarea.remove).toHaveBeenCalledOnce();
  expect(document.activeElement.focus).toHaveBeenCalledWith({preventScroll: true});
});
test('returns false and removes textarea on legacy failure', async () => {
  vi.stubGlobal('navigator', {});
  const {textarea, document} = fallback(false);
  expect(await copyText('text')).toBe(false);
  document.execCommand.mockImplementation(() => {throw new Error('blocked');});
  expect(await copyText('text')).toBe(false);
  expect(textarea.remove).toHaveBeenCalledTimes(2);
});
