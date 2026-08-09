import { useEffect, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { supabase } from "@/integrations/supabase/client";
import { RouteNotFound } from "@/lib/router";
import { Route as HomeRoute } from "@/pages/home";
import { Route as AboutRoute } from "@/pages/about";
import { Route as AuthRoute } from "@/pages/auth";
import { Route as ContactRoute } from "@/pages/contact";
import { Route as FaqRoute } from "@/pages/faq";
import { Route as OauthCallbackRoute } from "@/pages/oauth-callback";
import { Route as PrivacyRoute } from "@/pages/privacy";
import { Route as RefundRoute } from "@/pages/refund";
import { Route as ResetPasswordRoute } from "@/pages/reset-password";
import { Route as TermsRoute } from "@/pages/terms";
import { Route as TracksRoute } from "@/pages/tracks";
import { Route as TrackDetailRoute } from "@/pages/track-detail";
import { Route as CheckoutRoute } from "@/pages/_authenticated/checkout";
import { Route as DashboardRoute } from "@/pages/_authenticated/dashboard";
import { Route as WelcomeRoute } from "@/pages/_authenticated/welcome";
import { useState } from "react";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace(/^#/, ""));
      if (el) {
        el.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}

/** Client-side auth gate replacing the old `_authenticated` layout route. */
function RequireAuth({ children }: { children?: ReactNode }) {
  const [state, setState] = useState<"loading" | "in" | "out">("loading");

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active) setState(data.session ? "in" : "out");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(session ? "in" : "out");
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (state === "loading") {
    return <div className="min-h-screen bg-background" aria-busy="true" />;
  }
  if (state === "out") return <Navigate to="/auth" replace />;
  return <>{children ?? <Outlet />}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomeRoute.Page />} />
          <Route path="/about" element={<AboutRoute.Page />} />
          <Route path="/auth" element={<AuthRoute.Page />} />
          <Route path="/contact" element={<ContactRoute.Page />} />
          <Route path="/faq" element={<FaqRoute.Page />} />
          <Route path="/oauth-callback" element={<OauthCallbackRoute.Page />} />
          <Route path="/privacy" element={<PrivacyRoute.Page />} />
          <Route path="/refund" element={<RefundRoute.Page />} />
          <Route path="/reset-password" element={<ResetPasswordRoute.Page />} />
          <Route path="/terms" element={<TermsRoute.Page />} />
          <Route path="/tracks" element={<TracksRoute.Page />} />
          <Route path="/tracks/:slug" element={<TrackDetailRoute.Page />} />

          <Route element={<RequireAuth />}>
            <Route path="/checkout" element={<CheckoutRoute.Page />} />
            <Route path="/dashboard" element={<DashboardRoute.Page />} />
            <Route path="/welcome" element={<WelcomeRoute.Page />} />
          </Route>

          <Route path="*" element={<RouteNotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
