-- Добавляем колонку категории к услугам
ALTER TABLE public.services ADD COLUMN category text NOT NULL DEFAULT 'cleaning';

-- Обновляем категории для существующих услуг
UPDATE public.services SET category = 'cleaning' WHERE sort_order BETWEEN 1 AND 10;
UPDATE public.services SET category = 'dry_cleaning' WHERE sort_order BETWEEN 11 AND 20;
UPDATE public.services SET category = 'windows' WHERE sort_order BETWEEN 21 AND 27;