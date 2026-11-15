import { useSyncExternalStore } from 'react';
export type Route = '#/' | '#/today' | '#/library' | '#/history' | '#/settings' | '#/not-found';
const routes: Route[] = ['#/', '#/today', '#/library', '#/history', '#/settings'];
function currentRoute(): Route {
  return routes.includes(window.location.hash.split('?')[0] as Route) ? window.location.hash.split('?')[0] as Route : (window.location.hash===''?'#/':'#/not-found');
}
function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
}
export function useHashRoute(): Route {
  return useSyncExternalStore(subscribe, currentRoute, () => '#/');
}
