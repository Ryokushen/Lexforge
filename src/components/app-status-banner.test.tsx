/** @vitest-environment jsdom */

import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { AppStatusBanner } from "./app-status-banner";

vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({
    user: null,
    isOnline: false,
    syncState: "idle",
    syncError: null,
    retrySync: vi.fn(),
  }),
}));

vi.mock("@/lib/bootstrap-context", () => ({
  useBootstrap: () => ({
    seedStatus: "seeding",
    seedError: null,
    retrySeed: vi.fn(),
  }),
}));

describe("AppStatusBanner", () => {
  it("keeps the initial render stable by showing bootstrap before offline status", () => {
    const html = renderToString(<AppStatusBanner />);

    expect(html).toContain("Preparing your starter library");
    expect(html).not.toContain("Offline mode is active");
  });
});
