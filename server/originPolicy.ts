/** Exact allowlist in production; only literal RFC1918 IPv4 on Vite's port in dev. */
export function parseOrigins(value: string): string[] {
  const origins = value.split(',').map(s => s.trim().replace(/\/+$/, ''));
  if (!origins.length || origins.some(origin => {
    try { const url = new URL(origin); return !['http:', 'https:'].includes(url.protocol) || url.origin !== origin; }
    catch { return true; }
  })) throw new Error('INVALID_ALLOWED_ORIGIN');
  return [...new Set(origins)];
}
export function originPolicy(value: string, environment = process.env.NODE_ENV, vitePort = 5173) {
  const allowed = new Set(parseOrigins(value));
  return (origin: string): boolean => {
    origin = origin.replace(/\/+$/, '');
    if (allowed.has(origin)) return true;
    if (environment === 'production') return false;
    try {
      const url = new URL(origin);
      if (url.origin !== origin || url.protocol !== 'http:' || Number(url.port || 80) !== vitePort) return false;
      const parts = url.hostname.split('.');
      if (parts.length !== 4 || parts.some(s => !/^(0|[1-9]\d{0,2})$/.test(s) || Number(s) > 255)) return false;
      const [a,b] = parts.map(Number);
      return a === 10 || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31);
    } catch { return false; }
  };
}

/** Preserve the received origin's host, never credentials, query or arbitrary header text. */
export function logOrigin(origin: string): string {
  try { const url = new URL(origin); return ['http:', 'https:'].includes(url.protocol) ? url.origin : 'INVALID_ORIGIN'; }
  catch { return 'INVALID_ORIGIN'; }
}
