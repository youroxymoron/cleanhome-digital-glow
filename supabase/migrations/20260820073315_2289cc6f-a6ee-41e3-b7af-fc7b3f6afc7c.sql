-- Roles infrastructure
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Lock down content tables: public read, admin-only writes
DROP POLICY IF EXISTS "Public write access for services" ON public.services;
DROP POLICY IF EXISTS "Public write access for features" ON public.features;
DROP POLICY IF EXISTS "Public write access for contacts" ON public.contacts;
DROP POLICY IF EXISTS "Public write access for site_content" ON public.site_content;

CREATE POLICY "Admins can manage services"
ON public.services FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage features"
ON public.features FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage contacts"
ON public.contacts FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage site content"
ON public.site_content FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.services, public.features, public.contacts, public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services, public.features, public.contacts, public.site_content TO authenticated;
GRANT ALL ON public.services, public.features, public.contacts, public.site_content TO service_role;

-- Storage: public read stays, writes admin-only
DROP POLICY IF EXISTS "Public write access for images" ON storage.objects;
DROP POLICY IF EXISTS "Public update access for images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access for images" ON storage.objects;

CREATE POLICY "Admins can upload images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'images' AND public.has_role(auth.uid(), 'admin'));