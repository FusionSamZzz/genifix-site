# Как выложить GeniFix на Netlify (пошагово)

Инструкция для тех, кто делает это впервые.

---

## Что понадобится (15–30 минут)

1. Аккаунт **GitHub** (бесплатно) — https://github.com  
2. Аккаунт **Netlify** (бесплатно) — https://www.netlify.com  
3. Аккаунт **Neon** (бесплатная база данных) — https://neon.tech  

---

## Шаг 1. Загрузить код на GitHub

1. Зайдите на https://github.com и нажмите **New repository**
2. Название, например: `genifix-site`
3. Создайте репозиторий (можно без README)

На компьютере откройте терминал в папке проекта:

```bash
cd d:\genifix
git init
git add .
git commit -m "GeniFix website"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/genifix-site.git
git push -u origin main
```

Замените `ВАШ_ЛОГИН` на свой логин GitHub.

---

## Шаг 2. Создать базу данных (Neon)

1. Зайдите на https://neon.tech → **Sign up**
2. **New Project** → название `genifix`
3. Скопируйте **Connection string** (строка вида `postgresql://user:pass@...`)
4. Сохраните её — это будет `DATABASE_URI`

---

## Шаг 3. Подключить сайт к Netlify

1. Зайдите на https://app.netlify.com  
2. **Add new site** → **Import an existing project**  
3. Выберите **GitHub** и разрешите доступ  
4. Выберите репозиторий `genifix-site`  
5. Netlify сам подхватит настройки из `netlify.toml`:
   - Build command: `PAYLOAD_PUSH=true npm run build`
   - Publish: `.next` (через плагин Next.js)

**Пока не нажимайте Deploy** — сначала добавьте переменные.

---

## Шаг 4. Переменные окружения (важно!)

В Netlify: **Site configuration** → **Environment variables** → **Add a variable**

Добавьте **каждую** строку:

| Key | Value | Пример |
|-----|-------|--------|
| `DATABASE_URI` | Строка из Neon (шаг 2) | `postgresql://...` |
| `PAYLOAD_SECRET` | Любая длинная случайная строка | `mi-secreto-genifix-2026-muy-largo` |
| `ADMIN_EMAIL` | Ваш email админки | `fusionsamz@gmail.com` |
| `ADMIN_PASSWORD` | Ваш пароль админки | `onyxworld` |
| `NEXT_PUBLIC_SITE_URL` | URL сайта на Netlify | `https://sunny-baklava-9acf08.netlify.app` |

> **NEXT_PUBLIC_SITE_URL** — после первого деплоя Netlify покажет адрес сайта (например `https://random-name-123.netlify.app`). Его и вставьте. Потом можно обновить, если смените домен.

### ⚠️ Область действия переменных (критично для /admin)

При добавлении **каждой** переменной Netlify спрашивает **Scopes** (область):

- Выберите **All scopes** (или **All** — «Все»), **не** только «Builds».
- Если `DATABASE_URI` доступен только при сборке, главная страница может открываться, а **`/admin` и `/api/*` дадут Internal Server Error**.

Нажмите **Save** и запустите **Deploy site** (или **Trigger deploy**).

---

## Шаг 5. Первый вход в админку

1. Дождитесь зелёной галочки **Published** (3–8 минут)
2. Откройте: `https://ВАШ-САЙТ.netlify.app/admin`
3. Войдите:
   - Email: `fusionsamz@gmail.com`
   - Password: `onyxworld`

(Пользователь создаётся автоматически при первом запуске сервера, если его ещё нет.)

---

## Шаг 6. Как пользоваться админкой

### Продукты
**Admin Panel** → **Products** → **Create New**
- Nombre, SKU, Precio, foto (сначала загрузите в **Media**)

### Видео в разделе Productos
1. **Media** → **Create New** → загрузите MP4 (до ~100 MB)
2. **Globals** → **Configuración del sitio**
3. Выберите загруженное видео в поле **Archivo de video**
4. Заполните заголовок и описание → **Save**

Видео появится внизу секции Productos на главной.

---

## Шаг 7. Свой домен (необязательно)

Netlify → **Domain management** → **Add custom domain**  
Следуйте подсказкам Netlify для DNS у вашего регистратора.

После смены домена обновите `NEXT_PUBLIC_SITE_URL` в Environment variables.

---

## Частые проблемы

| Проблема | Решение |
|----------|---------|
| Build failed | Проверьте, что все 5 переменных окружения добавлены |
| `/admin` — Internal Server Error | У `DATABASE_URI` scope должен быть **All**. `NEXT_PUBLIC_SITE_URL` должен совпадать с URL сайта (например `https://sunny-baklava-9acf08.netlify.app`). Откройте `/api/health` для диагностики |
| Admin не открывается | Убедитесь, что `PAYLOAD_SECRET` задан |
| Не могу войти | Проверьте `ADMIN_EMAIL` и `ADMIN_PASSWORD` в Netlify |
| Фото/видео пропали после redeploy | На Netlify диск временный — для стабильности позже подключите Cloudinary/S3 |
| Сайт белый экран | Откройте **Deploy log** в Netlify и найдите ошибку |

---

## Обновление сайта после изменений

Каждый раз когда меняете код локально:

```bash
git add .
git commit -m "Update site"
git push
```

Netlify сам пересоберёт сайт за несколько минут.

---

## Локальная проверка перед деплоем

```bash
cd d:\genifix
npm install
npm run dev
```

- Сайт: http://localhost:3000  
- Админка: http://localhost:3000/admin (ссылка **Admin Panel** внизу сайта)
