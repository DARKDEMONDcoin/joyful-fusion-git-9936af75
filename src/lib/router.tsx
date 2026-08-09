/**
 * Small React-Router compatibility layer.
 *
 * The pages in this project were originally written for a file-based router,
 * so this module re-implements the handful of primitives they use (`Link`,
 * `useNavigate`, `useRouterState`, `useRouter`, page head metadata and a tiny
 * loader helper) on top of `react-router-dom`.
 */
import {
  Link as RRLink,
  Outlet,
  useLocation,
  useNavigate as useRRNavigate,
  useParams,
} from "react-router-dom";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ComponentType,
  type ReactNode,
} from "react";

export { Outlet, useParams, useLocation };

/* ------------------------------------------------------------------ paths */

export type NavTarget = {
  to?: string;
  params?: Record<string, string | number>;
  search?: Record<string, string | number | boolean | undefined>;
  hash?: string;
  replace?: boolean;
};

export function buildPath({ to = "", params, search, hash }: NavTarget) {
  let path = to.replace(/\$([A-Za-z0-9_]+)/g, (_m, key: string) =>
    encodeURIComponent(String(params?.[key] ?? "")),
  );
  if (search) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(search)) {
      if (v !== undefined && v !== null) qs.set(k, String(v));
    }
    const q = qs.toString();
    if (q) path += `?${q}`;
  }
  if (hash) path += hash.startsWith("#") ? hash : `#${hash}`;
  return path || "/";
}

/* ------------------------------------------------------------------- Link */

type LinkProps = NavTarget & {
  children?: ReactNode;
  className?: string;
  activeProps?: { className?: string };
  inactiveProps?: { className?: string };
  preload?: unknown;
  [key: string]: unknown;
};

export function Link({
  to,
  params,
  search,
  hash,
  replace,
  className,
  activeProps,
  inactiveProps,
  preload: _preload,
  children,
  ...rest
}: LinkProps) {
  const href = buildPath({ to, params, search, hash });
  const { pathname } = useLocation();
  const active = pathname === href.split("?")[0]!.split("#")[0];
  const cls = [className, active ? activeProps?.className : inactiveProps?.className]
    .filter(Boolean)
    .join(" ");

  return (
    <RRLink to={href} replace={replace} className={cls || undefined} {...rest}>
      {children}
    </RRLink>
  );
}

/* ------------------------------------------------------------- navigation */

export function useNavigate() {
  const navigate = useRRNavigate();
  return useMemo(
    () =>
      (target: string | NavTarget): Promise<void> => {
        if (typeof target === "string") {
          navigate(target);
        } else {
          navigate(buildPath(target), { replace: target.replace });
        }
        return Promise.resolve();
      },
    [navigate],
  );
}

export function useRouterState<T>({
  select,
}: {
  select: (state: { location: { pathname: string; hash: string; search: string } }) => T;
}): T {
  const location = useLocation();
  return select({
    location: {
      pathname: location.pathname,
      hash: location.hash,
      search: location.search,
    },
  });
}

export function useRouter() {
  const navigate = useRRNavigate();
  return useMemo(
    () => ({
      navigate: (target: string | NavTarget) =>
        navigate(typeof target === "string" ? target : buildPath(target)),
      invalidate: () => {},
      history: {
        canGoBack: () => typeof window !== "undefined" && window.history.length > 1,
        back: () => window.history.back(),
      },
    }),
    [navigate],
  );
}

/* ------------------------------------------------------------------- head */

export type HeadTag = Record<string, unknown>;
export type HeadConfig = {
  meta?: HeadTag[];
  links?: HeadTag[];
  scripts?: HeadTag[];
};

function applyHead(head: HeadConfig) {
  if (typeof document === "undefined") return () => {};
  const created: Element[] = [];
  const previousTitle = document.title;

  for (const tag of head.meta ?? []) {
    if (typeof tag["title"] === "string") {
      document.title = tag["title"];
      continue;
    }
    const el = document.createElement("meta");
    for (const [k, v] of Object.entries(tag)) el.setAttribute(k, String(v));
    document.head.appendChild(el);
    created.push(el);
  }

  for (const tag of head.links ?? []) {
    const el = document.createElement("link");
    for (const [k, v] of Object.entries(tag)) el.setAttribute(k, String(v));
    document.head.appendChild(el);
    created.push(el);
  }

  for (const tag of head.scripts ?? []) {
    const el = document.createElement("script");
    for (const [k, v] of Object.entries(tag)) {
      if (k === "children") el.textContent = String(v);
      else el.setAttribute(k, String(v));
    }
    document.head.appendChild(el);
    created.push(el);
  }

  return () => {
    document.title = previousTitle;
    for (const el of created) el.remove();
  };
}

export function useHead(head: HeadConfig | undefined) {
  const serialized = JSON.stringify(head ?? {});
  useEffect(() => {
    return applyHead(JSON.parse(serialized) as HeadConfig);
  }, [serialized]);
}

/* ---------------------------------------------------------------- not found */

export class NotFoundError extends Error {
  constructor() {
    super("Not found");
    this.name = "NotFoundError";
  }
}

export function notFound(): never {
  throw new NotFoundError();
}

/* ------------------------------------------------------------- page routes */

const LoaderDataContext = createContext<unknown>(undefined);

type PageRouteOptions<TLoaderData> = {
  loader?: (ctx: { params: Record<string, string> }) => TLoaderData;
  head?: (ctx: { loaderData?: TLoaderData }) => HeadConfig;
  component: ComponentType;
  /** Accepted for compatibility; the app is a client-rendered SPA. */
  ssr?: boolean;
};

export type PageRoute<TLoaderData> = {
  Page: ComponentType;
  useLoaderData: () => TLoaderData;
};

export function createPageRoute<TLoaderData = unknown>(
  options: PageRouteOptions<TLoaderData>,
): PageRoute<TLoaderData> {
  function Page() {
    const params = useParams() as Record<string, string>;

    let loaderData: TLoaderData | undefined;
    let missing = false;
    if (options.loader) {
      try {
        loaderData = options.loader({ params });
      } catch (error) {
        if (error instanceof NotFoundError) missing = true;
        else throw error;
      }
    }

    useHead(options.head?.({ loaderData }));

    if (missing) return <RouteNotFound />;

    const Component = options.component;
    return (
      <LoaderDataContext.Provider value={loaderData}>
        <Component />
      </LoaderDataContext.Provider>
    );
  }

  return {
    Page,
    useLoaderData: () => useContext(LoaderDataContext) as TLoaderData,
  };
}

export function RouteNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">الصفحة غير موجودة</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          الرابط اللي فتحته مش موجود أو اتنقل لمكان تاني.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            الرجوع للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
