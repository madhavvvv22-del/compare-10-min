"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "compare10-preferences";

interface Preferences {
  savedLocation?: string;
  preferredStores?: string[];
}

const defaults: Preferences = {
  savedLocation: "110001",
  preferredStores: [],
};

export function usePreferences() {
  const [prefs, setPrefs] = useState<Preferences>(defaults);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Preferences;
        setPrefs({ ...defaults, ...parsed });
      }
    } catch {
      // ignore
    }
  }, []);

  const update = useCallback((next: Partial<Preferences>) => {
    setPrefs((prev) => {
      const merged = { ...prev, ...next };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {
        // ignore
      }
      return merged;
    });
  }, []);

  return { preferences: prefs, updatePreferences: update };
}
