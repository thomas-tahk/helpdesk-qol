export type IncidentState = 'new' | 'in_progress' | 'on_hold' | 'resolved' | 'closed';
export type WorkNoteKind = 'work_note' | 'comment';

export interface WorkNote {
  id: string;
  author: string;
  kind: WorkNoteKind;
  body: string;
  createdAt: string;
}

export interface Incident {
  id: string;
  shortDescription: string;
  description: string;
  state: IncidentState;
  priority: 1 | 2 | 3 | 4 | 5;
  caller: string;
  category: string;
  assignmentGroup: string;
  assignedTo: string;
  openedAt: string;
  workNotes: WorkNote[];
}
