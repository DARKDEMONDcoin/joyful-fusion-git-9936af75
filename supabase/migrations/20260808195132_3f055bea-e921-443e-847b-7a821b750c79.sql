CREATE OR REPLACE FUNCTION public.course_touch_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.course_students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  full_name text,
  phone text,
  telegram_username text,
  access_code text NOT NULL DEFAULT upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  has_access boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.course_students TO authenticated;
GRANT ALL ON public.course_students TO service_role;
ALTER TABLE public.course_students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "students_select_own" ON public.course_students FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "students_insert_own" ON public.course_students FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND has_access = false);
CREATE POLICY "students_update_own" ON public.course_students FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER course_students_touch BEFORE UPDATE ON public.course_students FOR EACH ROW EXECUTE FUNCTION public.course_touch_updated_at();

CREATE TABLE public.course_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  order_id text NOT NULL UNIQUE,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'EGP',
  status text NOT NULL DEFAULT 'pending',
  kashier_ref text,
  raw jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.course_orders TO authenticated;
GRANT ALL ON public.course_orders TO service_role;
ALTER TABLE public.course_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_select_own" ON public.course_orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER course_orders_touch BEFORE UPDATE ON public.course_orders FOR EACH ROW EXECUTE FUNCTION public.course_touch_updated_at();

CREATE INDEX course_orders_user_idx ON public.course_orders (user_id);