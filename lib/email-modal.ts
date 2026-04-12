/** Tiny pub/sub so any client component can open the contact email modal. */

type Listener = () => void;

const listeners = new Set<Listener>();

export function subscribeEmailModalOpen(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function openEmailModal(): void {
  listeners.forEach((fn) => fn());
}
