/** Process-owned circuit state; no prompts, responses or credentials are stored. */
export class ModelCircuit {
  private entries = new Map<string, {failures: number; lastFailure: number; until: number; probe: boolean}>();
  constructor(private models: readonly string[], private now = () => Date.now()) {}
  private entry(model: string) {
    let value = this.entries.get(model);
    if (!value) { value = {failures: 0, lastFailure: 0, until: 0, probe: false}; this.entries.set(model, value); }
    return value;
  }
  available(model: string) { const e = this.entry(model); return !e.probe && this.now() >= e.until; }
  acquire(model: string) {
    if (!this.available(model)) return false;
    const e = this.entry(model);
    if (e.until) e.probe = true; // Only one half-open request may enter.
    return true;
  }
  release(model: string) { this.entry(model).probe = false; }
  success(model: string) { this.entries.set(model, {failures: 0, lastFailure: 0, until: 0, probe: false}); }
  failure(model: string) {
    const e = this.entry(model), now = this.now();
    e.failures = now - e.lastFailure <= 120_000 ? e.failures + 1 : 1;
    e.lastFailure = now;
    if (e.probe || e.failures >= 2) e.until = now + 120_000;
    e.probe = false;
  }
  /** Used only by the local fixed-case eval between requests. */
  reset() { this.entries.clear(); }
  snapshot() {
    return this.models.map(model => { const e = this.entry(model); return {model,
      state: (e.until > this.now() || e.probe ? 'open' : 'closed') as 'open' | 'closed',
      remainingSeconds: Math.max(0, Math.ceil((e.until - this.now()) / 1000))}; });
  }
}
