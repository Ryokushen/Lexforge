/** @vitest-environment jsdom */

import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PropsWithChildren } from "react";
import type { User } from "@supabase/supabase-js";

const getSessionMock = vi.hoisted(() => vi.fn());
const onAuthStateChangeMock = vi.hoisted(() => vi.fn());
const signInWithOAuthMock = vi.hoisted(() => vi.fn());
const signOutMock = vi.hoisted(() => vi.fn());
const unsubscribeMock = vi.hoisted(() => vi.fn());
const syncOnLoginMock = vi.hoisted(() => vi.fn());
const pushToCloudMock = vi.hoisted(() => vi.fn());

vi.mock("./supabase", () => ({
  supabase: {
    auth: {
      getSession: getSessionMock,
      onAuthStateChange: onAuthStateChangeMock,
      signInWithOAuth: signInWithOAuthMock,
      signOut: signOutMock,
    },
  },
}));

vi.mock("./sync", () => ({
  CLOUD_SYNC_EVENT: "lexforge-cloud-sync",
  syncOnLogin: syncOnLoginMock,
  pushToCloud: pushToCloudMock,
}));

import { AuthProvider, useAuth } from "./auth-context";

function emitCloudSyncEvent(detail: {
  state: "syncing" | "synced" | "error";
  error?: string;
  lastSyncAt?: string;
}) {
  window.dispatchEvent(new CustomEvent("lexforge-cloud-sync", { detail }));
}

function makeUser(): User {
  return { id: "user-1" } as User;
}

function wrapper({ children }: PropsWithChildren) {
  return <AuthProvider>{children}</AuthProvider>;
}

async function flushMicrotasks() {
  await Promise.resolve();
  await Promise.resolve();
}

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-11T12:00:00.000Z"));
    vi.clearAllMocks();
    const storage = new Map<string, string>();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem: vi.fn((key: string) => storage.get(key) ?? null),
        setItem: vi.fn((key: string, value: string) => {
          storage.set(key, value);
        }),
        removeItem: vi.fn((key: string) => {
          storage.delete(key);
        }),
      },
    });
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true,
    });

    getSessionMock.mockResolvedValue({ data: { session: { user: makeUser() } } });
    onAuthStateChangeMock.mockReturnValue({
      data: { subscription: { unsubscribe: unsubscribeMock } },
    });
  });

  it("retries failed syncs and periodically refreshes while signed in", async () => {
    const syncedAt = "2026-04-11T12:00:05.000Z";

    syncOnLoginMock
      .mockImplementationOnce(async () => {
        emitCloudSyncEvent({ state: "syncing" });
        throw new Error("Temporary outage");
      })
      .mockImplementation(async () => {
        emitCloudSyncEvent({ state: "syncing" });
        emitCloudSyncEvent({ state: "synced", lastSyncAt: syncedAt });
        return { lastSyncAt: syncedAt };
      });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await flushMicrotasks();
    });
    expect(syncOnLoginMock).toHaveBeenCalledTimes(1);
    expect(result.current.syncState).toBe("error");

    await act(async () => {
      vi.advanceTimersByTime(15_000);
      await flushMicrotasks();
    });

    expect(syncOnLoginMock).toHaveBeenCalledTimes(2);
    expect(result.current.syncState).toBe("synced");
    expect(result.current.lastSyncAt).toBe(syncedAt);

    await act(async () => {
      vi.advanceTimersByTime(5 * 60 * 1000);
      await flushMicrotasks();
    });

    expect(syncOnLoginMock).toHaveBeenCalledTimes(3);
  });

  it("recovers when restoring the auth session fails", async () => {
    getSessionMock.mockRejectedValueOnce(new Error("Session bootstrap failed"));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await flushMicrotasks();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.syncState).toBe("idle");
    expect(syncOnLoginMock).not.toHaveBeenCalled();
  });

  it("falls back to a usable signed-out state when session restore hangs", async () => {
    const deferred = createDeferred<{ data: { session: { user: User } | null } }>();
    getSessionMock.mockReturnValueOnce(deferred.promise);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(2500);
      await flushMicrotasks();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.syncState).toBe("idle");
    expect(syncOnLoginMock).not.toHaveBeenCalled();
  });
});
