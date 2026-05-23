import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchIncident } from '@/lib/api';
import { registerHotkey } from '@/lib/hotkeys';
import type { Incident, WorkNote } from '@/types';

export function IncidentView() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['incident', id],
    queryFn: () => fetchIncident(id!),
    enabled: !!id,
  });

  const composerRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    return registerHotkey({
      key: 'c',
      description: 'Focus composer',
      handler: (e) => {
        e.preventDefault();
        composerRef.current?.focus();
      },
    });
  }, []);

  if (isLoading) return <IncidentSkeleton />;
  if (isError)
    return (
      <div className="mx-auto max-w-4xl p-8 text-sm text-destructive">
        Failed to load: {(error as Error).message}
      </div>
    );
  if (!data) return null;

  return (
    <article className="mx-auto max-w-4xl space-y-6 p-8">
      <header className="space-y-1">
        <div className="text-sm tabular-nums text-muted-foreground">{data.id}</div>
        <h1 className="text-2xl font-semibold leading-tight">{data.shortDescription}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <StatePill state={data.state} />
          <span>Priority {data.priority}</span>
          <span aria-hidden="true">·</span>
          <span>Opened {formatDateTime(data.openedAt)}</span>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2" aria-label="Incident fields">
        <FieldRow label="Caller" value={data.caller} />
        <FieldRow label="Category" value={data.category} />
        <FieldRow label="Assignment group" value={data.assignmentGroup} />
        <FieldRow label="Assigned to" value={data.assignedTo} />
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground">Description</h2>
        <p className="text-sm leading-relaxed">{data.description}</p>
      </section>

      <section className="space-y-3" aria-label="Activity">
        <h2 className="text-sm font-medium text-muted-foreground">Activity</h2>
        <ol className="space-y-3">
          {data.workNotes.map((n) => (
            <WorkNoteItem key={n.id} note={n} />
          ))}
        </ol>
      </section>

      <section className="space-y-2">
        <label htmlFor="composer" className="text-sm font-medium text-muted-foreground">
          Add work note
        </label>
        <textarea
          id="composer"
          ref={composerRef}
          rows={4}
          placeholder="Type… (press c from anywhere outside an input to focus this)"
          className="w-full rounded-md border border-input bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <p className="text-xs text-muted-foreground">Slice 0 is read-only — submitting is wired up in the next slice.</p>
      </section>
    </article>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div>{value}</div>
    </div>
  );
}

function StatePill({ state }: { state: Incident['state'] }) {
  const label = state.replace('_', ' ');
  return (
    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
      {label}
    </span>
  );
}

function WorkNoteItem({ note }: { note: WorkNote }) {
  const isComment = note.kind === 'comment';
  return (
    <li className="rounded-md border border-border p-3 text-sm">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {note.author} · {isComment ? 'Customer comment' : 'Work note'}
        </span>
        <time dateTime={note.createdAt}>{formatDateTime(note.createdAt)}</time>
      </div>
      <p className="mt-1 whitespace-pre-wrap">{note.body}</p>
    </li>
  );
}

function IncidentSkeleton() {
  return (
    <div
      className="mx-auto max-w-4xl animate-pulse space-y-6 p-8"
      aria-busy="true"
      aria-label="Loading incident"
    >
      <div className="h-4 w-24 rounded bg-muted" />
      <div className="h-7 w-2/3 rounded bg-muted" />
      <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        <div className="h-10 rounded bg-muted/60" />
        <div className="h-10 rounded bg-muted/60" />
        <div className="h-10 rounded bg-muted/60" />
        <div className="h-10 rounded bg-muted/60" />
      </div>
      <div className="h-20 rounded bg-muted/60" />
      <div className="h-32 rounded bg-muted/60" />
    </div>
  );
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString();
}
