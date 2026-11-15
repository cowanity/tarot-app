/** No clipboard permission or secure context is required for the legacy fallback. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.clipboard?.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { /* Try the user-initiated legacy copy below. */ }
  if (typeof document === 'undefined') return false;
  let textarea: HTMLTextAreaElement | undefined;
  const previous = document.activeElement as HTMLElement | null;
  const selection = document.getSelection?.();
  const ranges: Range[] = [];
  try {
    if (selection) for (let i = 0; i < selection.rangeCount; i++) ranges.push(selection.getRangeAt(i).cloneRange());
    textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.readOnly = true;
    textarea.tabIndex = -1;
    textarea.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px;pointer-events:none;';
    document.body.appendChild(textarea);
    textarea.focus({preventScroll: true});
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    return typeof document.execCommand === 'function' && document.execCommand('copy');
  } catch {
    return false;
  } finally {
    textarea?.remove();
    try {
      previous?.focus({preventScroll: true});
      if (selection && ranges.length) {
        selection.removeAllRanges();
        ranges.forEach(range => selection.addRange(range));
      }
    } catch { /* Focus restoration must never break the reading. */ }
  }
}
