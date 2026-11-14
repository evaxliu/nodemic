import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delayMs);

    // A new keystroke cancels the previous timer
    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debounced;
}