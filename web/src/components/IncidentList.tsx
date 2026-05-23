import { useEffect, useRef } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchIncidents } from '@/lib/api';
import { registerHotkey } from '@/lib/hotkeys';
import type { IncidentSummary } from '@/types';

export function IncidentList() {
  const { data, isLoading } = useQuery({
    queryKey: ['incidents'],
    queryFn: fetchIncidents,
  });
  const navigate = useNavigate();
  const { id: activeId } = useParams();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unregisterSlash = registerHotkey({
      key: '/',
      description: 'Focus list search',
      handler: (e) => {
        e.preventDefault();
        searchRef.current?.focus();
      },
    });

    const unregisterJ = registerHotkey({
      key: 'j',
      description: 'Next incident',
      handler: () => {
        if (!data || data.length === 0) return;
        const idx = data.findIndex((i) => i.id === activeId);
        const next = data[Math.min(idx + 1, data.length - 1)];
        if (next) navigate(`/incidents/${next.id}`);
      },
    });

    const unregisterK = registerHotkey({
      key: 'k',
      description: 'Previous incident',
      handler: () => {
        if (!data || data.length === 0) return;
        const idx = data.findIndex((i) => i.id === activeId);
        const prev = data[Math.max(idx - 1, 0)];
        if (prev) navigate(`/incidents/${prev.id}`);
      },
    });

    return () => {
      unregisterSlash();
      unregisterJ();
      unregisterK();
    };
  }, [data, activeId, navigate]);

  return (
    <aside
      className="flex h-[calc(100svh-3rem)] w-72 shrink-0 flex-col border-r border-border bg-card"
      aria-label="Incident list"
    >
      <div className="border-b border-border p-3">
        <input
          ref={searchRef}
          type="search"
          placeholder="Search (press /)"
          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Search incidents"
        />
      </div>

      <div className="flex items-center justify-between px-3 pt-3 pb-1">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Incidents
        </h2>
        <span className="text-xs text-muted-foreground tabular-nums">
          {data?.length ?? 0}
        </span>
      </div>

      <ol className="flex-1 overflow-y-auto px-2 pb-3" aria-busy={isLoading}>
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="my-1 h-16 animate-pulse rounded-md bg-muted/60" />
            ))
          : data?.map((incident) => (
              <li key={incident.id}>
                <IncidentRow incident={incident} />
              </li>
            ))}
      </ol>
    </aside>
  );
}

function IncidentRow({ incident }: { incident: IncidentSummary }) {
  return (
    <NavLink
      to={`/incidents/${incident.id}`}
      className={({ isActive }) =>
        [
          'my-1 block rounded-md border px-3 py-2 text-left text-sm transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isActive
            ? 'border-primary/40 bg-primary/10'
            : 'border-transparent hover:bg-accent/40',
        ].join(' ')
      }
    >
      <div className="flex items-center gap-2">
        <PriorityChip priority={incident.priority} />
        <span className="truncate font-medium leading-tight">
          {incident.shortDescription}
        </span>
      </div>
      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
        <span className="truncate">
          {incident.id} · {incident.caller}
        </span>
        <span className="shrink-0">{formatRelative(incident.openedAt)}</span>
      </div>
    </NavLink>
  );
}

function PriorityChip({ priority }: { priority: IncidentSummary['priority'] }) {
  const styles: Record<number, string> = {
    1: 'bg-destructive text-destructive-foreground',
    2: 'bg-orange-500/90 text-white',
    3: 'bg-amber-400/90 text-amber-950',
    4: 'bg-secondary text-secondary-foreground',
    5: 'bg-muted text-muted-foreground',
  };
  return (
    <span
      className={`inline-flex h-5 w-7 shrink-0 items-center justify-center rounded text-[10px] font-semibold ${styles[priority]}`}
      aria-label={`Priority ${priority}`}
    >
      P{priority}
    </span>
  );
}

function formatRelative(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMin = Math.round((now - then) / 60000);
  if (diffMin < 1) return 'now';
  if (diffMin < 60) return `${diffMin}m`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.round(diffH / 24);
  return `${diffD}d`;
}
