import type { Route } from '../hooks/useHashRoute';
const links: { route: Route; label: string }[] = [
  { route: '#/', label: 'Trải bài' }, { route: '#/today', label: 'Hôm nay' }, { route: '#/library', label: 'Thư viện' },
  { route: '#/history', label: 'Lịch sử' }, { route: '#/settings', label: 'Cài đặt' },
];
export function Navigation({ route }: { route: Route }) {
  return <nav className="main-nav" aria-label="Điều hướng chính">
    {links.map((item) => <a key={item.route} href={item.route} aria-current={route === item.route ? 'page' : undefined}>{item.label}</a>)}
  </nav>;
}
