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
});
