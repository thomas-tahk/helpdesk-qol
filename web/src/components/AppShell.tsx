import { Outlet } from 'react-router-dom';
import { IncidentList } from './IncidentList';

export function AppShell() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <TopBar />
      <div className="flex">
        <IncidentList />
        <main className="flex-1 overflow-y-auto" style={{ height: 'calc(100svh - 3rem)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <header
      className="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-border bg-card px-4"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold tracking-tight">Helpdesk QOL</span>
        <span className="text-xs text-muted-foreground">Incidents</span>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="tabular-nums">agent.demo</span>
      </div>
    </header>
  );
}
