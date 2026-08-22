# Защита формы от спама

## Что реализовано

- единая серверная функция `submit-contact` вместо двух публичных endpoints;
- проверка разрешённого домена и типа/размера запроса;
- скрытое поле-ловушка и минимальное время заполнения формы;
- лимит: не более двух попыток за 10 минут с одного IP;
- постоянный лимит в PostgreSQL, общий для всех экземпляров Edge Function;
- блокировка повторной одинаковой заявки на 30 минут;
- блокировка ссылок в имени и сообщении;
- опциональная проверка Cloudflare Turnstile на сервере;
- старые `send-telegram` и `send-max` возвращают `410 Gone` после вывода новой формы в работу.

В таблице лимитов сохраняются только SHA-256-хеши IP и заявки. Открытые IP,
имена и телефоны в ней не сохраняются.

## Порядок публикации без перерыва в работе формы

Из корня проекта:

```bash
npx supabase login
npx supabase db push
npx supabase functions deploy submit-contact --use-api --project-ref djasykbaoqceslmfusfj
```

Затем загрузить содержимое архива `cleanhousednr.ru-timeweb-2026-08-22-v6.zip`
на хостинг и только после этого отключить старые endpoints:

```bash
npx supabase functions deploy send-telegram send-max --use-api --project-ref djasykbaoqceslmfusfj
```

## Усиленная защита Cloudflare Turnstile

Базовая защита работает без CAPTCHA. Для защиты от распределённых атак с
подменой IP рекомендуется создать бесплатный Turnstile-виджет для доменов
`cleanhousednr.ru` и `www.cleanhousednr.ru`.

Секретный ключ хранится только в Supabase:

```bash
npx supabase secrets set TURNSTILE_SECRET_KEY=СЕКРЕТНЫЙ_КЛЮЧ --project-ref djasykbaoqceslmfusfj
```

Публичный site key добавить в локальный `.env`:

```text
VITE_TURNSTILE_SITE_KEY=ПУБЛИЧНЫЙ_SITE_KEY
```

После этого повторно выполнить `npm run build`, пересобрать архив и загрузить
его на хостинг. Серверная проверка обязательна: одного виджета в браузере
недостаточно.

## Проверка после публикации

1. Обычная заявка должна прийти в Telegram и MAX один раз.
2. Повторная идентичная заявка не должна дублироваться в мессенджерах.
3. Третья новая заявка с одного IP за 10 минут должна получить ограничение.
4. Старые endpoints `send-telegram` и `send-max` должны отвечать `410`.
