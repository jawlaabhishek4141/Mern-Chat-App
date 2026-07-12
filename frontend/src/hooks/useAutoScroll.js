import { useEffect, useRef } from 'react';

/**
 * Returns a ref to attach to a scroll sentinel element at the bottom of a
 * list; scrolls it into view whenever `dep` changes (e.g. message count),
 * giving the classic "auto-scroll to newest message" chat behaviour.
 */
export function useAutoScroll(dep) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [dep]);

  return bottomRef;
}
