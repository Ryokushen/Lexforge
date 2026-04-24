import {
  createClient,
  type AuthChangeEvent,
  type Session,
  type SupabaseClient,
} from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const SUPABASE_CONFIG_ERROR =
  "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.";

function createUnavailableClient(): SupabaseClient {
  const error = new Error(SUPABASE_CONFIG_ERROR);

  return {
    from() {
      throw error;
    },
    auth: {
      onAuthStateChange(
        callback: (event: AuthChangeEvent, session: Session | null) => void,
      ) {
        queueMicrotask(() => callback("INITIAL_SESSION", null));
        return {
          data: {
            subscription: {
              unsubscribe() {},
            },
          },
        };
      },
      async getSession() {
        return {
          data: { session: null },
          error: null,
        };
      },
      async signInWithOAuth() {
        return {
          data: { provider: "github", url: null },
          error,
        };
      },
      async signOut() {
        return { error };
      },
    },
  } as unknown as SupabaseClient;
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createUnavailableClient();
