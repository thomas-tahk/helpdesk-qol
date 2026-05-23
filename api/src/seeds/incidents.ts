// Built in isolated session; no real-system data referenced.
// Six mock Incidents across a spread of states, priorities, and queues.

import type { Incident } from '../types.ts';

export const incidents: Incident[] = [
  {
    id: 'INC0010089',
    shortDescription: 'Shared drive permissions request for new finance hire',
    description:
      'New hire on the finance team needs read/write access to the FY26-Close share. Manager has approved over email. Standard onboarding ask.',
    state: 'new',
    priority: 5,
    caller: 'Casey Park',
    category: 'File Shares & Permissions',
    assignmentGroup: 'Collaboration Tools',
    assignedTo: 'agent.osman',
    openedAt: '2026-05-20T09:14:00.000Z',
    workNotes: [],
  },
  {
    id: 'INC0010083',
    shortDescription: 'Outlook search index corrupted after profile rebuild',
    description:
      'After we rebuilt the user profile yesterday to clear a sync issue, Outlook search now returns no results for any folder. Indexing options show "0 items indexed" and the rebuild button does nothing.',
    state: 'on_hold',
    priority: 3,
    caller: 'Taylor Reed',
    category: 'Endpoint / Email',
    assignmentGroup: 'Endpoint Support',
    assignedTo: 'agent.kim',
    openedAt: '2026-05-20T08:02:00.000Z',
    workNotes: [
      {
        id: 'wn-83-1',
        author: 'agent.kim',
        kind: 'work_note',
        body: 'Triggered manual index rebuild via control panel. On hold pending overnight reindex; will verify in the morning.',
        createdAt: '2026-05-20T08:35:00.000Z',
      },
    ],
  },
  {
    id: 'INC0010071',
    shortDescription: 'SSO redirect loop with new identity provider',
    description:
      'Multiple users in the engineering org report being bounced between the IdP and the internal portal indefinitely. Started ~22:00 last night, suspected coincident with the IdP config change pushed yesterday evening.',
    state: 'in_progress',
    priority: 1,
    caller: 'Alex Morgan',
    category: 'Identity & Access / SSO',
    assignmentGroup: 'Identity & Access',
    assignedTo: 'agent.fox',
    openedAt: '2026-05-19T22:47:00.000Z',
    workNotes: [
      {
        id: 'wn-71-1',
        author: 'agent.fox',
        kind: 'work_note',
        body: 'P1 paged. Engaged IdP vendor; they confirmed receiving similar reports from other tenants. Rollback of yesterday\'s claim mapping in progress.',
        createdAt: '2026-05-19T23:12:00.000Z',
      },
      {
        id: 'wn-71-2',
        author: 'agent.fox',
        kind: 'comment',
        body: 'Posting an interim update on the status page: SSO degraded, workaround is direct portal login for now.',
        createdAt: '2026-05-19T23:40:00.000Z',
      },
    ],
  },
  {
    id: 'INC0010055',
    shortDescription: 'Printer offline in north wing conference room',
    description:
      'Floor printer (north wing, 4F) showing offline on both the queue and the device LCD. Power-cycled once already with no change. Three meetings stacked back-to-back this morning need it.',
    state: 'new',
    priority: 4,
    caller: 'Sam Patel',
    category: 'Print Services',
    assignmentGroup: 'Print Services',
    assignedTo: 'agent.lee',
    openedAt: '2026-05-19T18:30:00.000Z',
    workNotes: [],
  },
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
  {
    id: 'INC0010038',
    shortDescription: 'VPN client crashes immediately on login',
    description:
      'VPN client crashes about two seconds after the user enters credentials. Crash log points at a known compatibility issue with the November agent release. User is unblocked via web portal in the meantime.',
    state: 'resolved',
    priority: 2,
    caller: 'Jordan Chen',
    category: 'VPN / Remote Access',
    assignmentGroup: 'Endpoint Support',
    assignedTo: 'agent.kim',
    openedAt: '2026-05-18T11:09:00.000Z',
    workNotes: [
      {
        id: 'wn-38-1',
        author: 'agent.kim',
        kind: 'work_note',
        body: 'Rolled the VPN agent back to the prior LTS build via Intune. Crash no longer reproducible.',
        createdAt: '2026-05-18T13:55:00.000Z',
      },
      {
        id: 'wn-38-2',
        author: 'agent.kim',
        kind: 'comment',
        body: 'Confirmed working from your end? I\'ll resolve this once you give the all-clear.',
        createdAt: '2026-05-18T14:02:00.000Z',
      },
    ],
  },
];
