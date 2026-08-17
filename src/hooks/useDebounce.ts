import { useState, useEffect } from 'react';

/**
 * Returns a debounced version of the given value.
 * It only updates if the value stays unchanged for the specified delay.
 */
export function useDebounce<T>(value: T, delay = 3000): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
