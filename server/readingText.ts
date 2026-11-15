/** Traverse values only, never object keys; diagnostics contain lengths, not text. */
export function textEntries(value: unknown, path = ''): {path: string; text: string}[] {
  if (typeof value === 'string') return [{path, text: value}];
  if (Array.isArray(value)) return value.flatMap((item, i) => textEntries(item, `${path}.${i}`));
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([key, item]) => textEntries(item, path ? `${path}.${key}` : key));
  return [];
}
export const readingStrings = (value: unknown) => textEntries(value).map(({text}) => text);
export const fieldLengths = (value: unknown) => Object.fromEntries(textEntries(value).map(({path, text}) => [path, text.length]));
