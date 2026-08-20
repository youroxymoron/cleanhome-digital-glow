CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_role text,
  rating integer NOT NULL DEFAULT 5,
  text text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  before_image_url text,
  after_image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.reviews, public.faq_items, public.gallery_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews, public.faq_items, public.gallery_items TO authenticated;
GRANT ALL ON public.reviews, public.faq_items, public.gallery_items TO service_role;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Admins can manage reviews" ON public.reviews FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read access for faq_items" ON public.faq_items FOR SELECT USING (true);
CREATE POLICY "Admins can manage faq_items" ON public.faq_items FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read access for gallery_items" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Admins can manage gallery_items" ON public.gallery_items FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_faq_items_updated_at BEFORE UPDATE ON public.faq_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gallery_items_updated_at BEFORE UPDATE ON public.gallery_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();