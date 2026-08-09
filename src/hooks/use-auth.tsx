import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import {
  useAuth as useClerkAuth,
  useUser as useClerkUser,
  useClerk,
} from "@clerk/clerk-react";

import { supabase } from "@/integrations/supabase/client";
import { clerkEnabled, setClerkTokenGetter } from "@/lib/clerk-supabase";

type AuthState = {
  session: Session | null;
  user: User | null;
  /** true until the persisted session has been restored from storage */
  loading: boolean;
  /** مصدر الجلسة: supabase (إيميل/جوجل) أو clerk (أبل) */
  provider: "supabase" | "clerk" | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

/** يوفّر جلسة Supabase فقط — يُستخدم لو Clerk مش متاح. */
function useSupabaseSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // Register the listener FIRST so no auth event is missed.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setLoading(false);
    });

    void supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setSession(data.session);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, setSession, loading };
}

function ClerkBridge() {
  const { isSignedIn, getToken } = useClerkAuth();

  useEffect(() => {
    if (!isSignedIn) {
      setClerkTokenGetter(null);
      return;
    }
    setClerkTokenGetter(() => getToken());
    return () => setClerkTokenGetter(null);
  }, [isSignedIn, getToken]);

  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { session, setSession, loading } = useSupabaseSession();

  // Clerk hooks آمنة هنا لأن ClerkProvider يلفّ الشجرة دائمًا (بمفتاح أو بدون).
  const clerkAuth = clerkEnabled ? useClerkAuth() : null;
  const clerkUser = clerkEnabled ? useClerkUser() : null;
  const clerk = clerkEnabled ? useClerk() : null;

  const clerkSignedIn = Boolean(clerkAuth?.isSignedIn);
  const clerkLoaded = clerkEnabled ? Boolean(clerkAuth?.isLoaded) : true;

  const value = useMemo<AuthState>(() => {
    const cu = clerkUser?.user;
    const clerkAsUser: User | null =
      clerkSignedIn && cu
        ? ({
            id: cu.id,
            email: cu.primaryEmailAddress?.emailAddress ?? "",
            user_metadata: {
              full_name: cu.fullName ?? "",
              avatar_url: cu.imageUrl ?? "",
            },
            app_metadata: { provider: "apple" },
            aud: "authenticated",
            created_at: cu.createdAt?.toISOString() ?? new Date().toISOString(),
          } as unknown as User)
        : null;

    const effectiveSession =
      session ??
      (clerkAsUser
        ? ({ user: clerkAsUser, access_token: "clerk" } as unknown as Session)
        : null);

    return {
      session: effectiveSession,
      user: effectiveSession?.user ?? null,
      loading: loading || !clerkLoaded,
      provider: session ? "supabase" : clerkAsUser ? "clerk" : null,
      signOut: async () => {
        if (session) {
          await supabase.auth.signOut();
          setSession(null);
        }
        if (clerkSignedIn && clerk) await clerk.signOut();
      },
    };
  }, [session, setSession, loading, clerkSignedIn, clerkUser, clerkLoaded, clerk]);

  return (
    <AuthContext.Provider value={value}>
      {clerkEnabled && <ClerkBridge />}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
