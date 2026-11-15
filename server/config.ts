import {parseOrigins} from './originPolicy';
import { existsSync } from 'node:fs';
// Node 22's built-in loader; never imported by the client.
if (existsSync('.env')) process.loadEnvFile('.env');
export function config(env: NodeJS.ProcessEnv = process.env) {
  const cap = Number(env.AI_DAILY_CAP ?? 150);
  const hourly=Number(env.AI_HOURLY_IP_LIMIT??20);
  const shutdownMs=Number(env.SHUTDOWN_TIMEOUT_MS??120000);
  if(!Number.isInteger(hourly)||hourly<1||hourly>10000)throw new Error('INVALID_HOURLY_LIMIT');
  if(!Number.isInteger(shutdownMs)||shutdownMs<1000||shutdownMs>600000)throw new Error('INVALID_SHUTDOWN_TIMEOUT');
  const origin = env.ALLOWED_ORIGIN ?? 'http://localhost:5173';
  if (!Number.isInteger(cap) || cap < 1 || cap > 1_000_000) throw new Error('INVALID_DAILY_CAP');
  parseOrigins(origin);
  const vitePort = Number(env.VITE_PORT ?? 5173);
  if (!Number.isInteger(vitePort) || vitePort < 1 || vitePort > 65535) throw new Error('INVALID_VITE_PORT');
  const provider = env.AI_PROVIDER ?? 'anthropic';
  if (provider !== 'anthropic' && provider !== 'gemini') throw new Error('INVALID_AI_PROVIDER');
  const keyName = provider === 'gemini' ? 'GEMINI_API_KEY' : 'ANTHROPIC_API_KEY';
  const apiKey = env[keyName]?.trim();
  if (!apiKey) throw new Error(`MISSING_${keyName}`);
  const model = env.AI_MODEL?.trim() || (provider === 'gemini' ? 'gemini-3.5-flash-lite' : 'claude-sonnet-5-5');
  const fallbackModel = env.AI_FALLBACK_MODEL?.trim() || '';
  const validModel = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/;
  if (!validModel.test(model)) throw new Error('INVALID_AI_MODEL');
  if (fallbackModel && !validModel.test(fallbackModel)) throw new Error('INVALID_AI_FALLBACK_MODEL');
  const rawFallbacks = env.AI_FALLBACK_MODELS ?? (env.AI_FALLBACK_MODEL !== undefined ? fallbackModel : provider === 'gemini' ? 'gemini-3.5-flash' : '');
  const fallbackModels = [...new Set(rawFallbacks.split(',').map(s => s.trim()).filter(Boolean))];
  if (fallbackModels.length > 8 || fallbackModels.some(name => !validModel.test(name))) throw new Error('INVALID_AI_FALLBACK_MODELS');
  return { hourly,shutdownMs,vitePort, fallbackModels: fallbackModels.filter(name => name !== model), cap, origin, provider: provider as 'gemini' | 'anthropic', apiKey, model, fallbackModel, freeTier: env.AI_FREE_TIER === 'true' };
}

export type Settings = ReturnType<typeof config>;
