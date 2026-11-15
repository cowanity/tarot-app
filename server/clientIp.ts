import {isIP} from 'node:net';
export function isLoopback(ip:string|undefined){return ip==='::1'||ip==='::ffff:127.0.0.1'||Boolean(ip&&/^127\./.test(ip)&&isIP(ip)===4);}
/** Trust Cloudflare's header only on loopback ingress from local cloudflared. Never XFF. */
export function clientIp(cfConnectingIp:string|undefined,socketIp:string|undefined):string{
 const forwarded=cfConnectingIp?.trim();return isLoopback(socketIp)&&forwarded&&isIP(forwarded)?forwarded:socketIp??'unknown';
}
