import { useEffect } from 'react';

/** Calls `onOutsideClick` when a click/touch happens outside `ref.current`. */
export function useClickOutside(ref, onOutsideClick) {
  useEffect(() => {
    function handler(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick();
      }
    }
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [ref, onOutsideClick]);
}
