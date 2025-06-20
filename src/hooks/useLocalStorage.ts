
"use client";

import { useState, useEffect, Dispatch, SetStateAction } from 'react';

type SetValue<T> = Dispatch<SetStateAction<T>>;

function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          console.log(`[useLocalStorage] Initial sync read for key "${key}":`, item);
          return JSON.parse(item);
        }
      } catch (error) {
        console.error(`[useLocalStorage] Error initial sync reading localStorage key "${key}":`, error);
      }
    }
    console.log(`[useLocalStorage] No initial value for key "${key}" in sync read, using default.`);
    return initialValue;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          const parsedItem = JSON.parse(item);
          if (JSON.stringify(parsedItem) !== JSON.stringify(storedValue)) {
             console.log(`[useLocalStorage] useEffect read for key "${key}" (found state divergence, updating state):`, item);
            setStoredValue(parsedItem);
          }
        } else {
          // If localStorage is empty for this key, but we have a storedValue (e.g. from initialValue or previous state),
          // ensure it's written back to localStorage.
          console.log(`[useLocalStorage] No item for key "${key}" in localStorage (useEffect read), attempting to persist current storedValue:`, storedValue);
          window.localStorage.setItem(key, JSON.stringify(storedValue));
        }
      } catch (error) {
        console.error(`[useLocalStorage] Error in useEffect reading/syncing localStorage key "${key}":`, error);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]); // Rerun if key changes.

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        console.log(`[useLocalStorage] Attempting to write to key "${key}":`, storedValue);
        window.localStorage.setItem(key, JSON.stringify(storedValue));
        console.log(`[useLocalStorage] Successfully wrote to key "${key}".`);
      } catch (error) {
        console.error(`[useLocalStorage] Error setting localStorage key "${key}":`, error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
