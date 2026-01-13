-- Таблица для блоков контента сайта
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  block_key TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Таблица для услуг
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Home',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT,
  full_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Таблица для преимуществ (почему мы)
CREATE TABLE public.features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Shield',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Таблица для контактной информации
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_type TEXT NOT NULL,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  href TEXT,
  icon TEXT NOT NULL DEFAULT 'Phone',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS на всех таблицах
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Публичный доступ на чтение (для отображения на сайте)
CREATE POLICY "Public read access for site_content" 
ON public.site_content FOR SELECT USING (true);

CREATE POLICY "Public read access for services" 
ON public.services FOR SELECT USING (true);

CREATE POLICY "Public read access for features" 
ON public.features FOR SELECT USING (true);

CREATE POLICY "Public read access for contacts" 
ON public.contacts FOR SELECT USING (true);

-- Публичный доступ на запись (без авторизации, как запросил пользователь)
CREATE POLICY "Public write access for site_content" 
ON public.site_content FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public write access for services" 
ON public.services FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public write access for features" 
ON public.features FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public write access for contacts" 
ON public.contacts FOR ALL USING (true) WITH CHECK (true);

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_features_updated_at
BEFORE UPDATE ON public.features
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
BEFORE UPDATE ON public.contacts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Bucket для хранения изображений
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Политики для storage
CREATE POLICY "Public read access for images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "Public write access for images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Public update access for images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images');

CREATE POLICY "Public delete access for images"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');

-- Начальные данные для контента
INSERT INTO public.site_content (block_key, content) VALUES
('hero', '{"title": "Чистота и свежесть вашего дома", "subtitle": "Профессиональный клининг в Донецке", "description": "Доверьте уборку профессионалам. Мы используем безопасные технологии и современное оборудование для идеальной чистоты вашего пространства.", "features": ["Экологичные средства", "Опытные специалисты", "Гарантия качества"], "stats": {"years": "5+", "clients": "500+", "cleanings": "1000+"}}'),
('services_header', '{"title": "Полный спектр клининговых услуг", "subtitle": "Наши услуги", "description": "Мы предлагаем широкий выбор услуг по уборке для жилых и коммерческих помещений"}'),
('why_us_header', '{"title": "Доверьте чистоту профессионалам", "subtitle": "Почему мы", "description": "За годы работы мы создали команду настоящих профессионалов, которые любят своё дело и стремятся к идеальному результату."}'),
('contacts_header', '{"title": "Свяжитесь с нами", "subtitle": "Контакты", "description": "Оставьте заявку или позвоните нам — мы ответим на все вопросы и поможем выбрать подходящую услугу"}'),
('footer', '{"description": "Профессиональный клининг для вашего дома и офиса. Работаем в Донецке и ДНР."}');

-- Начальные услуги
INSERT INTO public.services (title, description, price, icon, sort_order, full_description) VALUES
('Уборка квартир', 'Комплексная уборка жилых помещений с использованием экологичных средств', 'от 2 500 ₽', 'Home', 1, 'Профессиональная генеральная и поддерживающая уборка квартир любой площади. Мы тщательно очищаем все поверхности, моем окна, убираем пыль и грязь из труднодоступных мест.'),
('Уборка офисов', 'Поддержание чистоты рабочих пространств для комфортной работы', 'от 4 000 ₽', 'Building2', 2, 'Регулярная уборка офисных помещений с учётом специфики рабочего графика. Дезинфекция рабочих поверхностей, уход за напольными покрытиями.'),
('Химчистка мебели', 'Глубокая чистка диванов, кресел и ковров профессиональным оборудованием', 'от 1 500 ₽', 'Sofa', 3, 'Удаление пятен любой сложности с мягкой мебели и ковровых покрытий. Используем гипоаллергенные средства, безопасные для детей и животных.'),
('Дезинфекция', 'Полная дезинфекция помещений для устранения бактерий и вирусов', 'от 3 000 ₽', 'SprayCan', 4, 'Комплексная дезинфекция помещений сертифицированными препаратами. Эффективно уничтожает вирусы, бактерии и неприятные запахи.'),
('Мойка окон', 'Качественная мойка окон любой сложности на любых этажах', 'от 500 ₽/окно', 'Sparkles', 5, 'Профессиональная мойка окон с обеих сторон, включая рамы и подоконники. Работаем на любой высоте.'),
('Уборка после ремонта', 'Удаление строительной пыли и мусора после ремонтных работ', 'от 5 000 ₽', 'HardHat', 6, 'Полное удаление строительной пыли, остатков материалов и мусора. Подготовим помещение к заселению.');

-- Начальные преимущества
INSERT INTO public.features (title, description, icon, sort_order) VALUES
('Гарантия качества', 'Если вас что-то не устроит, мы вернёмся и исправим бесплатно', 'Shield', 1),
('Точно в срок', 'Приезжаем вовремя и выполняем работу в оговорённые сроки', 'Clock', 2),
('Эко-средства', 'Используем безопасные для здоровья и экологии моющие средства', 'Leaf', 3),
('Опытная команда', 'Все наши специалисты имеют опыт работы более 3 лет', 'Award', 4),
('Индивидуальный подход', 'Учитываем все ваши пожелания и особенности помещения', 'Users', 5),
('Доступные цены', 'Честное ценообразование без скрытых платежей', 'ThumbsUp', 6);

-- Начальные контакты
INSERT INTO public.contacts (contact_type, label, value, href, icon, sort_order) VALUES
('phone', 'Телефон', '+7 949 501 57 51', 'tel:+79495015751', 'Phone', 1),
('phone', 'Второй телефон', '+7 988 585 26 94', 'tel:+79885852694', 'Phone', 2),
('email', 'Email', 'info@cleanhousednr.ru', 'mailto:info@cleanhousednr.ru', 'Mail', 3),
('address', 'Адрес', 'г. Донецк, ДНР', '#', 'MapPin', 4),
('hours', 'Режим работы', 'Пн-Сб: 8:00 - 20:00', '#', 'Clock', 5);