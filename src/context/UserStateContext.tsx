import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Monument } from "@/components/explore/data/monuments";

export type SavedCollection = {
  monumentId: string;
  name: string;
  image: string;
  location: { city: string; state: string };
  dynasty: string;
  dateSaved: string; // ISO string
};

export type SavedTrail = {
  trailId: string;
  name: string;
  city: string;
  state: string;
  image: string;
  stops: number;
  durationMinutes: number;
  dateSaved: string; // ISO string
};

export type Activity = {
  id: string;
  title: string;
  action: string;
  timestamp: string; // ISO string
};

export type Settings = {
  darkTheme: boolean;
  notificationsEnabled: boolean;
};

type UserState = {
  savedCollections: SavedCollection[];
  savedTrails: SavedTrail[];
  favorites: string[]; // Monument IDs
  favoriteTrails: string[]; // Trail IDs
  recentActivity: Activity[];
  settings: Settings;
  stats: {
    monumentsViewed: number;
    scanCount: number;
    explorationCount: number;
  };
};

const defaultSettings: Settings = {
  darkTheme: true,
  notificationsEnabled: true,
};

const defaultState: UserState = {
  savedCollections: [],
  savedTrails: [],
  favorites: [],
  favoriteTrails: [],
  recentActivity: [],
  settings: defaultSettings,
  stats: {
    monumentsViewed: 0,
    scanCount: 0,
    explorationCount: 0,
  },
};

type UserStateContextType = {
  state: UserState;
  toggleSave: (monument: Monument) => void;
  toggleSaveTrail: (trail: SavedTrail) => void;
  removeTrail: (trailId: string) => void;
  toggleFavorite: (monumentId: string) => void;
  toggleFavoriteTrail: (trailId: string) => void;
  addActivity: (title: string, action: string) => void;
  removeActivity: (id: string) => void;
  clearActivity: () => void;
  incrementStat: (key: keyof UserState["stats"]) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  clearData: (
    key: "favorites" | "favoriteTrails" | "savedCollections" | "savedTrails" | "recentActivity",
  ) => void;
  removeSave: (monumentId: string) => void;
};

const UserStateContext = createContext<UserStateContextType | undefined>(undefined);

export function UserStateProvider({ children }: { children: ReactNode }) {
  // Start from the pristine default on BOTH server and client so SSR output and
  // the first client render always match (no hydration mismatch). Persisted
  // state is loaded after mount, client-only, where localStorage exists.
  const [state, setState] = useState<UserState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  // Client-only hydration of previously saved state.
  useEffect(() => {
    try {
      const stored = localStorage.getItem("heritage_user_state");
      if (stored) {
        setState((prev) => ({ ...prev, ...JSON.parse(stored) }));
      }
    } catch (e) {
      console.warn("Could not parse user state from localStorage", e);
    } finally {
      setHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist state changes — but never before hydration completes, otherwise
  // the pristine default would clobber the stored data on first load.
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("heritage_user_state", JSON.stringify(state));
  }, [hydrated, state]);

  const addActivity = (title: string, action: string) => {
    const newActivity: Activity = {
      id: crypto.randomUUID(),
      title,
      action,
      timestamp: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      recentActivity: [newActivity, ...prev.recentActivity].slice(0, 50) // keep last 50
    }));
  };

  const toggleSave = (monument: Monument) => {
    setState(prev => {
      const isSaved = prev.savedCollections.some(s => s.monumentId === monument.id);
      if (isSaved) {
        return {
          ...prev,
          savedCollections: prev.savedCollections.filter(s => s.monumentId !== monument.id)
        };
      } else {
        const newSave: SavedCollection = {
          monumentId: monument.id,
          name: monument.name,
          image: monument.images[0] ?? "",
          location: monument.location,
          dynasty: monument.dynasty,
          dateSaved: new Date().toISOString(),
        };
        return {
          ...prev,
          savedCollections: [newSave, ...prev.savedCollections]
        };
      }
    });
  };

  const removeSave = (monumentId: string) => {
    setState(prev => ({
      ...prev,
      savedCollections: prev.savedCollections.filter(s => s.monumentId !== monumentId)
    }));
  };

  const toggleFavorite = (monumentId: string) => {
    setState(prev => {
      const isFav = prev.favorites.includes(monumentId);
      if (isFav) {
        return {
          ...prev,
          favorites: prev.favorites.filter(id => id !== monumentId)
        };
      } else {
        return {
          ...prev,
          favorites: [...prev.favorites, monumentId]
        };
      }
    });
  };

  const toggleSaveTrail = (trail: SavedTrail) => {
    setState(prev => {
      const isSaved = prev.savedTrails.some(t => t.trailId === trail.trailId);
      if (isSaved) {
        return {
          ...prev,
          savedTrails: prev.savedTrails.filter(t => t.trailId !== trail.trailId)
        };
      }
      return {
        ...prev,
        savedTrails: [trail, ...prev.savedTrails]
      };
    });
  };

  const removeTrail = (trailId: string) => {
    setState(prev => ({
      ...prev,
      savedTrails: prev.savedTrails.filter(t => t.trailId !== trailId)
    }));
  };

  const toggleFavoriteTrail = (trailId: string) => {
    setState(prev => {
      const isFav = prev.favoriteTrails.includes(trailId);
      return {
        ...prev,
        favoriteTrails: isFav
          ? prev.favoriteTrails.filter(id => id !== trailId)
          : [...prev.favoriteTrails, trailId]
      };
    });
  };

  const removeActivity = (id: string) => {
    setState(prev => ({
      ...prev,
      recentActivity: prev.recentActivity.filter(a => a.id !== id)
    }));
  };

  const clearActivity = () => {
    setState(prev => ({ ...prev, recentActivity: [] }));
  };

  const incrementStat = (key: keyof UserState["stats"]) => {
    setState(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [key]: prev.stats[key] + 1
      }
    }));
  };

  const updateSettings = (updates: Partial<Settings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates }
    }));
  };

  const clearData = (
    key: "favorites" | "favoriteTrails" | "savedCollections" | "savedTrails" | "recentActivity",
  ) => {
    setState(prev => ({
      ...prev,
      [key]: []
    }));
  };

  return (
    <UserStateContext.Provider value={{
      state,
      toggleSave,
      removeSave,
      toggleSaveTrail,
      removeTrail,
      toggleFavorite,
      toggleFavoriteTrail,
      addActivity,
      removeActivity,
      clearActivity,
      incrementStat,
      updateSettings,
      clearData
    }}>
      {children}
    </UserStateContext.Provider>
  );
}

export function useUserState() {
  const context = useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserStateProvider");
  }
  return context;
}
