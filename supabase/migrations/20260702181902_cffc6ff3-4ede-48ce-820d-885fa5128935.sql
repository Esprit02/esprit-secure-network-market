
-- PROFILES
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  gender TEXT,
  language TEXT,
  timezone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- VPN VAULT (admin-only inventory)
CREATE TABLE public.vpn_vault (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly','yearly')),
  api_key_or_config TEXT NOT NULL,
  is_sold BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.vpn_vault TO service_role;
ALTER TABLE public.vpn_vault ENABLE ROW LEVEL SECURITY;
-- No policies for anon/authenticated: only service_role (server-side) touches vault.

-- ORDERS
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vpn_vault_id UUID REFERENCES public.vpn_vault(id) ON DELETE SET NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly','yearly')),
  amount_ngn INTEGER NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed')),
  reference_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users create own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
