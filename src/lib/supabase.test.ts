import { afterEach, describe, expect, it, vi } from "vitest";

describe("supabase client fallback", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("returns an empty auth session when Supabase is not configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    vi.resetModules();

    const { isSupabaseConfigured, supabase } = await import("./supabase");

    expect(isSupabaseConfigured).toBe(false);
    await expect(supabase.auth.getSession()).resolves.toEqual({
      data: { session: null },
      error: null,
    });
  });
});
