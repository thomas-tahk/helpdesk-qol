import type { Incident } from '@/types';

const API_BASE = 'http://localhost:3000';

export async function fetchIncident(id: string): Promise<Incident> {
  const res = await fetch(`${API_BASE}/incidents/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Incident not found');
    throw new Error(`Failed to fetch incident: ${res.status}`);
  }
  return (await res.json()) as Incident;
}
