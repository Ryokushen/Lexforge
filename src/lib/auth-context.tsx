"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import {
  CLOUD_SYNC_EVENT,
  pushToCloud,
  syncOnLogin,
  type CloudSyncEventDetail,
} from "./sync";

const LAST_SYNC_STORAGE_KEY = "lexforge-last-sync-at";
const LAST_SYNC_ATTEMPT_STORAGE_KEY = "lexforge-last-sync-attempt-at";
const LAST_SYNC_ERROR_STORAGE_KEY = "lexforge-last-sync-error";
const LAST_SYNC_ERROR_AT_STORAGE_KEY = "lexforge-last-sync-error-at";

function readStorageValue(key: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

export type CloudSyncState =
  | "idle"
  | "syncing"
  | "synced"
  | "offline"
  | "error";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  syncState: CloudSyncState;
  syncError: string | null;
  lastSyncError: string | null;
  lastSyncAt: string | null;
  lastSyncAttemptAt: string | null;
  lastSyncErrorAt: string | null;
  isOnline: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  syncNow: () => Promise<void>;
  retrySync: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  syncState: "idle",
  syncError: null,
  lastSyncError: null,
  lastSyncAt: null,
  lastSyncAttemptAt: null,
  lastSyncErrorAt: null,
  isOnline: true,
  signIn: async () => {},
  signOut: async () => {},
  syncNow: async () => {},
  retrySync: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncState, setSyncState] = useState<CloudSyncState>("idle");
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncError, setLastSyncError] = useState<string | null>(() =>
    readStorageValue(LAST_SYNC_ERROR_STORAGE_KEY),
  );
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(() => {
    return readStorageValue(LAST_SYNC_STORAGE_KEY);
  });
  const [lastSyncAttemptAt, setLastSyncAttemptAt] = useState<string | null>(() =>
    readStorageValue(LAST_SYNC_ATTEMPT_STORAGE_KEY),
  );
  const [lastSyncErrorAt, setLastSyncErrorAt] = useState<string | null>(() =>
    readStorageValue(LAST_SYNC_ERROR_AT_STORAGE_KEY),
  );
  const [isOnline, setIsOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine,
  );

  const persistValue = useCallback((key: string, value: string | null) => {
    if (typeof window === "undefined") return;

    if (value) {
      window.localStorage.setItem(key, value);
    } else {
      window.localStorage.removeItem(key);
    }
  }, []);

  const persistLastSync = useCallback((timestamp: string | null) => {
    setLastSyncAt(timestamp);
    persistValue(LAST_SYNC_STORAGE_KEY, timestamp);
  }, [persistValue]);

  const persistSyncAttempt = useCallback((timestamp: string | null) => {
    setLastSyncAttemptAt(timestamp);
    persistValue(LAST_SYNC_ATTEMPT_STORAGE_KEY, timestamp);
  }, [persistValue]);

  const clearCurrentSyncError = useCallback(() => {
    setSyncError(null);
  }, []);

  const persistSyncError = useCallback((message: string, timestamp: string) => {
    setSyncError(message);
    setLastSyncError(message);
    setLastSyncErrorAt(timestamp);
    persistValue(LAST_SYNC_ERROR_STORAGE_KEY, message);
    persistValue(LAST_SYNC_ERROR_AT_STORAGE_KEY, timestamp);
  }, [persistValue]);

  const runCloudSync = useCallback(async (currentUser: User, mode: "login" | "push" = "login") => {
    const attemptAt = new Date().toISOString();
    persistSyncAttempt(attemptAt);

    if (!navigator.onLine) {
      setSyncState("offline");
      clearCurrentSyncError();
      return;
    }

    try {
      clearCurrentSyncError();
      if (mode === "push") {
        await pushToCloud(currentUser);
      } else {
        await syncOnLogin(currentUser);
      }
    } catch (error) {
      setSyncState(navigator.onLine ? "error" : "offline");
      persistSyncError(
        error instanceof Error ? error.message : "Cloud sync failed",
        new Date().toISOString(),
      );
    }
  }, [clearCurrentSyncError, persistSyncAttempt, persistSyncError]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        void runCloudSync(currentUser);
      } else {
        clearCurrentSyncError();
        setSyncState(navigator.onLine ? "idle" : "offline");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await runCloudSync(currentUser);
        } else {
          clearCurrentSyncError();
          setSyncState(navigator.onLine ? "idle" : "offline");
        }
      },
    );

    return () => subscription.unsubscribe();
  }, [clearCurrentSyncError, runCloudSync]);

  useEffect(() => {
    function handleSyncEvent(event: Event) {
      const detail = (event as CustomEvent<CloudSyncEventDetail>).detail;

      if (detail.state === "syncing") {
        setSyncState("syncing");
        clearCurrentSyncError();
        return;
      }

      if (detail.state === "synced") {
        const nextSyncAt = detail.lastSyncAt ?? new Date().toISOString();
        persistLastSync(nextSyncAt);
        clearCurrentSyncError();
        setSyncState(navigator.onLine ? "synced" : "offline");
        return;
      }

      persistSyncError(
        detail.error ?? "Cloud sync failed",
        new Date().toISOString(),
      );
      setSyncState(navigator.onLine ? "error" : "offline");
    }

    function handleOnline() {
      setIsOnline(true);
      clearCurrentSyncError();

      if (user) {
        void runCloudSync(user);
      } else {
        setSyncState("idle");
      }
    }

    function handleOffline() {
      setIsOnline(false);
      setSyncState("offline");
    }

    window.addEventListener(CLOUD_SYNC_EVENT, handleSyncEvent as EventListener);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener(
        CLOUD_SYNC_EVENT,
        handleSyncEvent as EventListener,
      );
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [clearCurrentSyncError, persistLastSync, persistSyncError, runCloudSync, user]);

  const signIn = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    clearCurrentSyncError();
    setSyncState(navigator.onLine ? "idle" : "offline");
  }, [clearCurrentSyncError]);

  const syncNow = useCallback(async () => {
    if (!user) return;
    await runCloudSync(user, "push");
  }, [runCloudSync, user]);

  const retrySync = useCallback(async () => {
    if (!user) return;
    await runCloudSync(user);
  }, [runCloudSync, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        syncState,
        syncError,
        lastSyncError,
        lastSyncAt,
        lastSyncAttemptAt,
        lastSyncErrorAt,
        isOnline,
        signIn,
        signOut,
        syncNow,
        retrySync,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
