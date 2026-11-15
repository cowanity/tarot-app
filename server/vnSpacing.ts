const TONES = /[\u0300\u0301\u0303\u0309\u0323]/g;
const VIET_MARK = /[ăâêôơưđ\u0300\u0301\u0303\u0309\u0323\u0306\u0302\u031b]/;
const SYL = /^(ngh|ng|gh|gi|kh|nh|ph|th|tr|ch|qu|[bcdđghklmnpqrstvx])?([aăâeêioôơuưy]{1,3})(ch|ng|nh|c|m|n|p|t)?$/;
export function badTokens(text: string, allow: ReadonlySet<string> = new Set()): string[] {
  const out: string[] = [];
  for (const raw of text.normalize('NFC').split(/[^\p{L}]+/u)) {
    if (!raw) continue;
    const low = raw.toLowerCase();
    if (allow.has(low)) continue;
    const nfd = low.normalize('NFD');
    if (!VIET_MARK.test(nfd)) continue; // chỉ kiểm token có dấu tiếng Việt, bỏ qua token tiếng Anh/ASCII
    const base = nfd.replace(TONES, '').normalize('NFC');
    if (!SYL.test(base)) out.push(raw);
  }
  return out;
}
