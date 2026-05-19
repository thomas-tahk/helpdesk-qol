// Built in isolated session; no real-system data referenced.
// Slice 0 seed: one mock Incident with enough texture to drive layout decisions.

import type { Incident } from '../types.ts';

export const incidents: Incident[] = [
  {
    id: 'INC0010042',
    shortDescription: "Laptop won't connect to office Wi-Fi after OS update",
    description:
      'Caller reports their work laptop fails to associate with the corporate SSID after applying an OS update yesterday afternoon. Personal hotspot and home Wi-Fi both work normally. Other devices on the same desk connect fine.',
    state: 'in_progress',
    priority: 3,
    caller: 'Robin Avery',
    category: 'Network / Wi-Fi',
    assignmentGroup: 'Helpdesk - Tier 1',
    assignedTo: 'agent.demo',
    openedAt: '2026-05-19T14:12:00.000Z',
    workNotes: [
      {
        id: 'wn-1',
        author: 'agent.demo',
        kind: 'work_note',
        body: 'Confirmed adapter reports the corporate SSID in scan results but auth fails. Will try forgetting and re-adding the network.',
        createdAt: '2026-05-19T14:31:00.000Z',
      },
      {
        id: 'wn-2',
        author: 'agent.demo',
        kind: 'comment',
        body: "Hi Robin — could you try restarting the laptop once more and let me know if the SSID prompts you for credentials when you select it? I'd like to rule out a stuck credential cache before we go further.",
        createdAt: '2026-05-19T14:48:00.000Z',
      },
      {
        id: 'wn-3',
        author: 'agent.demo',
        kind: 'work_note',
        body: 'No response yet; following up after lunch if still silent.',
        createdAt: '2026-05-19T15:20:00.000Z',
      },
    ],
  },
];
