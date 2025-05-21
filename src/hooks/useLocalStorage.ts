
"use client";

import { useState, useEffect, Dispatch, SetStateAction } from 'react';

type SetValue<T> = Dispatch<SetStateAction<T>>;

function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  // Initialize state with initialValue.
  // This ensures that the server and client render the same thing initially.
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Effect to load the value from localStorage on the client side, after mounting.
  useEffect(() => {
    // Checking for window is good practice, though useEffect only runs on client.
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const item = window.localStorage.getItem(key);
      // If the item exists in localStorage, parse it and update the state.
      // Otherwise, the state remains `initialValue`.
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      // If an error occurs (e.g., parsing error), log it and use initialValue.
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [key]); // Dependency array ensures this runs once on mount (per key)

  // Effect to update localStorage whenever the storedValue changes.
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      // Save the current state to localStorage.
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      // If an error occurs (e.g., storage full), log it.
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
