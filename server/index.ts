import {createRequestDrain,createShutdown} from './shutdown';
import {clientIp} from './clientIp';
import { serve } from '@hono/node-server';
import { getConnInfo } from '@hono/node-server/conninfo';
import { createApp } from './app';
import { createProvider } from './provider';
import { config } from './config';
const settings = config();
const provider = createProvider(settings);
const app = createApp({ provider, providerName: settings.provider, freeTier: settings.freeTier, model: settings.model, origin: settings.origin, vitePort: settings.vitePort, cap: settings.cap, hourlyLimit:settings.hourly,
  // Loopback-only ingress; Cloudflare supplies CF-Connecting-IP. Ignore X-Forwarded-For.
  ip: (c) => clientIp(c.req.header('CF-Connecting-IP'), getConnInfo(c).remote.address), log: (entry) => console.log(JSON.stringify(entry)),
});
const drain=createRequestDrain(app.fetch);
const server=serve({ fetch: drain.fetch, port: 8787, hostname: '127.0.0.1' });
const stop=createShutdown(server,drain,settings.shutdownMs);
for(const signal of ['SIGTERM','SIGINT'] as const)process.once(signal,()=>{void stop().then(clean=>process.exit(clean?0:1));});
