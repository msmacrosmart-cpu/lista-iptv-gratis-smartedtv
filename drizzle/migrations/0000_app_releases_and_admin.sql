CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  must_change_password boolean NOT NULL DEFAULT true,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.mark_password_changed()
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.user_roles SET must_change_password = false WHERE user_id = auth.uid();
$$;
REVOKE EXECUTE ON FUNCTION public.mark_password_changed() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.mark_password_changed() TO authenticated;

CREATE TABLE public.app_releases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL DEFAULT 'SMARTEDTV.apk',
  storage_path text,
  download_url text,
  version text NOT NULL DEFAULT '',
  release_notes text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT release_has_source CHECK (storage_path IS NOT NULL OR download_url IS NOT NULL),
  CONSTRAINT release_url_https CHECK (download_url IS NULL OR download_url ~* '^https://')
);
CREATE UNIQUE INDEX app_releases_one_active ON public.app_releases (is_active) WHERE is_active;
GRANT SELECT ON public.app_releases TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.app_releases TO authenticated;
GRANT ALL ON public.app_releases TO service_role;
ALTER TABLE public.app_releases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads active release" ON public.app_releases FOR SELECT TO anon, authenticated USING (is_active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert releases" ON public.app_releases FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update releases" ON public.app_releases FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete releases" ON public.app_releases FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER app_releases_touch BEFORE UPDATE ON public.app_releases FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.publish_release(_filename text, _storage_path text, _download_url text, _version text, _release_notes text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_id uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'not authorized'; END IF;
  UPDATE public.app_releases SET is_active = false WHERE is_active;
  INSERT INTO public.app_releases (filename, storage_path, download_url, version, release_notes, is_active)
  VALUES (_filename, NULLIF(_storage_path,''), NULLIF(_download_url,''), _version, _release_notes, true)
  RETURNING id INTO new_id;
  RETURN new_id;
END $$;
REVOKE EXECUTE ON FUNCTION public.publish_release(text,text,text,text,text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.publish_release(text,text,text,text,text) TO authenticated;