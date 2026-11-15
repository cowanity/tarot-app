/** Ignore malformed refs; never invent a page or a book. */
export function formatRefs(refs: readonly string[]): string[] {
  const books = { H: new Set<number>(), P: new Set<number>() };
  for (const ref of refs) {
    const match = /^([HP])-tr\.(\d+)$/.exec(ref.trim());
    if (!match) continue;
    const page = Number(match[2]);
    if (Number.isSafeInteger(page) && page > 0) books[match[1] as 'H' | 'P'].add(page);
  }
  return (['H', 'P'] as const).flatMap((book) => {
    const pages = [...books[book]].sort((a, b) => a - b);
    const ranges: string[] = [];
    for (let i = 0; i < pages.length; i++) {
      const start = pages[i];
      while (i + 1 < pages.length && pages[i + 1] === pages[i] + 1) i++;
      ranges.push(start === pages[i] ? String(start) : `${start}–${pages[i]}`);
    }
    return ranges.length ? [`${book === 'H' ? 'Huggens' : 'Pollack'} · tr. ${ranges.join(', ')}${book === 'H' ? '*' : ''}`] : [];
  });
}
