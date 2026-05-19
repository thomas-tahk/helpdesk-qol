export interface HotkeyBinding {
  key: string;
  handler: (e: KeyboardEvent) => void;
  description: string;
}

const bindings = new Set<HotkeyBinding>();
let installed = false;

function dispatch(e: KeyboardEvent) {
  const active = document.activeElement as HTMLElement | null;
  const isTyping =
    active?.tagName === 'INPUT' ||
    active?.tagName === 'TEXTAREA' ||
    active?.isContentEditable === true;
  if (isTyping) return;
  for (const b of bindings) {
    if (e.key === b.key) {
      b.handler(e);
      break;
    }
  }
}

function ensureInstalled() {
  if (installed || typeof document === 'undefined') return;
  installed = true;
  document.addEventListener('keydown', dispatch);
}

export function registerHotkey(b: HotkeyBinding): () => void {
  ensureInstalled();
  bindings.add(b);
  return () => {
    bindings.delete(b);
  };
}

export function listHotkeys(): HotkeyBinding[] {
  return [...bindings];
}
