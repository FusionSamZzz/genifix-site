# Как выложить GeniFix на Vercel бесплатно (пошагово)

Инструкция для тех, кто делает это впервые. **Vercel Hobby — бесплатно** для небольших сайтов.

База данных — **Neon** (у вас уже есть, бесплатно).  
Код — **GitHub** (репозиторий `genifix-site`).

---

## Что понадобится (15–20 минут)

1. Аккаунт **GitHub** — уже есть  
2. Аккаунт **Vercel** — https://vercel.com (можно войти через GitHub)  
3. Строка **DATABASE_URI** из Neon — уже есть  

---

## Шаг 1. Зарегистрироваться на Vercel

1. Откройте https://vercel.com  
2. **Sign Up** → **Continue with GitHub**  
3. Разрешите Vercel доступ к GitHub  

---

## Шаг 2. Импортировать проект

1. На главной Vercel нажмите **Add New…** → **Project**  
2. Найдите репозиторий **`genifix-site`** (или `FusionSamZzz/genifix-site`)  
3. Нажмите **Import**  

Vercel сам увидит **Next.js** — ничего в настройках сборки менять не нужно.

---

## Шаг 3. Переменные окружения (ВАЖНО — до Deploy!)

Перед первым деплоем нажмите **Environment Variables** и добавьте **каждую** строку:

| Key | Value | Пример |
|-----|-------|--------|
| `DATABASE_URI` | Строка из Neon | `postgresql://neondb_owner:...@ep-....neon.tech/neondb?sslmode=require` |
| `PAYLOAD_SECRET` | Длинная случайная строка | `genifix-onyx-secret-2026-fusionsamz` |
| `ADMIN_EMAIL` | Email админки | `fusionsamz@gmail.com` |
| `ADMIN_PASSWORD` | Пароль админки | `onyxworld` |
| `NEXT_PUBLIC_SITE_URL` | Пока можно оставить пустым или поставить позже | см. шаг 5 |

Для каждой переменной оставьте галочки **Production**, **Preview**, **Development** (все три).

> **`NEXT_PUBLIC_SITE_URL`** — после первого деплоя Vercel покажет адрес вида `https://genifix-site.vercel.app`. Его и вставьте (шаг 5).

---

## Шаг 4. Первый деплой

1. Нажмите **Deploy**  
2. Подождите 3–8 минут (зелёная галочка **Ready**)  
3. Нажмите **Visit** — откроется ваш сайт  

---

## Шаг 5. Обновить URL сайта (один раз)

1. Скопируйте адрес сайта с Vercel (например `https://genifix-site-xxx.vercel.app`)  
2. Vercel → ваш проект → **Settings** → **Environment Variables**  
3. Добавьте или измените **`NEXT_PUBLIC_SITE_URL`** → вставьте этот адрес (без `/` в конце)  
4. **Deployments** → у последнего деплоя **⋯** → **Redeploy** (только если хотите обновить мета-теги; админка и так должна работать)  

На Vercel адрес подхватывается автоматически, но для SEO лучше задать `NEXT_PUBLIC_SITE_URL`.

---

## Шаг 6. Проверка

| Что проверить | Адрес |
|---------------|--------|
| Главная | `https://ВАШ-САЙТ.vercel.app` |
| Диагностика | `https://ВАШ-САЙТ.vercel.app/api/health` — должно быть `"ok": true` и `"payload": { "ok": true }` |
| Админка | `https://ВАШ-САЙТ.vercel.app/admin` |

**Вход в админку:**
- Email: `fusionsamz@gmail.com`  
- Password: `onyxworld`  

---

## Шаг 7. Свой домен (необязательно, потом)

Vercel → **Settings** → **Domains** → добавьте свой домен.  
Следуйте подсказкам DNS у регистратора.

---

## Частые проблемы

| Проблема | Решение |
|----------|---------|
| Build failed | Проверьте, что все переменные добавлены **до** деплоя |
| `/admin` — ошибка 500 | Откройте `/api/health` — смотрите поле `hint` и `payload.error` |
| Не могу войти | Проверьте `ADMIN_EMAIL` и `ADMIN_PASSWORD` |
| Фото пропали после redeploy | На бесплатном serverless диск временный — позже подключим Cloudinary/S3 |
| Слишком долго грузится админка | Первый заход после простоя — 5–15 сек, это нормально |

---

## Локальная проверка перед деплоем (на компьютере)

```powershell
d:
cd \genifix
npm run verify
npm run dev
```

- Сайт: http://localhost:3000  
- Админка: http://localhost:3000/admin  

---

## Обновление сайта после изменений в коде

```powershell
git add .
git commit -m "Update site"
git push
```

Vercel **сам** пересоберёт сайт (если подключён GitHub).  
Не жмите Redeploy вручную без нужды — каждая сборка тратит лимит (на Hobby его обычно хватает).

---

## Netlify больше не нужен

Сайт на Netlify можно не трогать или удалить проект в Netlify, чтобы не путаться.  
**Neon** (база) — **оставляем**, она общая для любого хостинга.

---

## Безопасность

Если пароль Neon когда-то светился в чате — в Neon → **Reset password** → обновите `DATABASE_URI` в Vercel → Redeploy.
