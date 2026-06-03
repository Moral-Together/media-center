# מרכז המדיה של ישראל — Медиа-центр Израиля

Корпоративный сайт цифрового агентства полного цикла. Иврит (RTL), анимации, адаптивный дизайн, SEO-оптимизация.

**Продакшн:** https://media.moraltogether.com/

---

## Содержание

- [Технологический стек](#технологический-стек)
- [Структура проекта](#структура-проекта)
- [Быстрый старт](#быстрый-старт)
- [Скрипты](#скрипты)
- [Страницы и маршруты](#страницы-и-маршруты)
- [Компоненты](#компоненты)
- [Библиотека анимаций](#библиотека-анимаций)
- [SEO](#seo)
- [Производительность](#производительность)
- [Доступность (a11y)](#доступность-a11y)
- [Тестирование](#тестирование)
- [Сборка и деплой](#сборка-и-деплой)
- [Переменные окружения](#переменные-окружения)
- [Стилизация](#стилизация)

---

## Технологический стек

| Категория | Технология | Версия |
|---|---|---|
| UI | React | 19 |
| Язык | TypeScript | 5.8 |
| Сборщик | Vite | 6 |
| CSS-фреймворк | Tailwind CSS | 4 |
| Анимации | Motion (framer-motion) | 12 |
| Роутинг | React Router DOM | 7 |
| Иконки | Lucide React | 0.546 |
| Утилиты CSS | clsx + tailwind-merge | — |
| Тесты | Vitest + Testing Library | 4 |
| Деплой | GitHub Pages (Actions) | — |

---

## Структура проекта

```
media-center/
├── public/                    # Статические файлы (копируются as-is в dist/)
│   ├── favicon.ico            # Фавикон 32×32
│   ├── favicon.png            # PNG-версия фавикона
│   ├── apple-touch-icon.png   # Иконка для iOS
│   ├── logo_play.png          # Логотип (анимированный spin)
│   ├── logo_text.png          # Текстовый логотип в hero-секции
│   ├── og-image.png           # Open Graph изображение 1200×630
│   ├── robots.txt             # Директивы для краулеров
│   ├── sitemap.xml            # XML-карта сайта
│   └── CNAME                  # Custom domain для GitHub Pages
│
├── scripts/
│   └── generate-og.mjs        # Генерация og-image.png через sharp (запускается перед build)
│
├── src/
│   ├── __tests__/             # Тесты
│   │   ├── utils.test.ts      # Тесты утилиты cn()
│   │   ├── motion.test.ts     # Тесты useAnimatedCounter
│   │   ├── ErrorBoundary.test.tsx
│   │   ├── Layout.test.tsx
│   │   ├── PageMeta.test.tsx
│   │   └── pages/
│   │       ├── Home.test.tsx
│   │       ├── AboutUs.test.tsx
│   │       ├── Services.test.tsx
│   │       ├── Portfolio.test.tsx
│   │       ├── Contact.test.tsx
│   │       └── NotFound.test.tsx
│   │
│   ├── components/
│   │   ├── ErrorBoundary.tsx  # React error boundary (class component)
│   │   ├── Layout.tsx         # Шапка + подвал + навигация + progress bar
│   │   ├── Logo.tsx           # SVG-логотип с анимацией spin
│   │   └── PageMeta.tsx       # Динамические SEO мета-теги (title, og:*, hreflang, JSON-LD)
│   │
│   ├── lib/
│   │   ├── motion.ts          # Presets анимаций + хук useAnimatedCounter
│   │   ├── seo.ts             # Константы SEO (SITE_URL, SITE_NAME и др.)
│   │   └── utils.ts           # cn() — merge clsx + tailwind-merge
│   │
│   ├── pages/
│   │   ├── Home.tsx           # Главная: dark hero, aurora, stats, preview сервисов
│   │   ├── AboutUs.tsx        # О нас: история, статистика, миссия
│   │   ├── Services.tsx       # Услуги: 6 карточек с 3D-hover
│   │   ├── Portfolio.tsx      # Портфолио: 6 проектов с zoom
│   │   ├── Contact.tsx        # Контакты: email, телефон, CTA
│   │   └── NotFound.tsx       # 404 страница
│   │
│   ├── App.tsx                # Маршруты (lazy-loaded страницы)
│   ├── main.tsx               # Точка входа (BrowserRouter, StrictMode)
│   ├── index.css              # Tailwind + кастомные CSS-анимации + scrollbar
│   ├── test-setup.ts          # Vitest setup: jest-dom, mock IntersectionObserver/ResizeObserver
│   └── vite-env.d.ts          # Типы Vite
│
├── index.html                 # HTML-шаблон: RTL, мета-теги, шрифты, JSON-LD Organization
├── vite.config.ts             # Vite конфиг + Vitest конфиг
├── tsconfig.json              # TypeScript конфиг (strict, vitest/globals)
├── package.json
└── .github/
    └── workflows/
        └── deploy-pages.yml   # CI/CD деплой на GitHub Pages
```

---

## Быстрый старт

```bash
# 1. Установить зависимости
npm install

# 2. Запустить dev-сервер (http://localhost:3000)
npm run dev

# 3. Запустить тесты
npm test

# 4. Проверить типы
npm run lint
```

---

## Скрипты

| Команда | Описание |
|---|---|
| `npm run dev` | Dev-сервер на порту 3000 (host 0.0.0.0) |
| `npm run build` | Генерация OG-изображения → Vite build → копирование `dist/index.html` в `dist/404.html` |
| `npm run preview` | Полная сборка + локальный preview |
| `npm run lint` | Проверка TypeScript без эмита (`tsc --noEmit`) |
| `npm run clean` | Удалить папку `dist/` |
| `npm run og:image` | Только генерация `public/og-image.png` (через sharp) |
| `npm test` | Запуск всех тестов один раз (`vitest run`) |
| `npm run test:watch` | Тесты в watch-режиме |
| `npm run test:coverage` | Тесты с отчётом покрытия (`vitest run --coverage`) |

---

## Страницы и маршруты

| Маршрут | Компонент | Описание |
|---|---|---|
| `/` | `Home` | Главная с тёмным hero, aurora-эффектами и превью услуг |
| `/about` | `AboutUs` | История компании, статистика, миссия и ценности |
| `/services` | `Services` | Шесть услуг: разработка, кибербезопасность, SEO, PPC, видео, контент |
| `/portfolio` | `Portfolio` | Шесть кейсов с изображениями и категориями |
| `/contact` | `Contact` | Email, телефон, CTA-кнопка |
| `*` | `NotFound` | 404 страница (noindex) |

Все страницы загружаются через `React.lazy()` — код каждой страницы в отдельном чанке.

---

## Компоненты

### `Layout`

Обёртка для всех маршрутов. Содержит:

- **Фиксированная шапка** — логотип, навигация, CTA-кнопка «Связаться»
- **Scroll progress bar** — градиентная полоса внизу шапки (cyan → violet → pink), привязана к `useScroll`
- **Мобильное меню** — drawer с анимацией slide, focus trap, закрытие по `Escape`
- **Body scroll lock** — `overflow: hidden` на `<body>` пока меню открыто
- **Skip-link** — «Перейти к основному содержимому», видим только при фокусе (доступность)
- **`AnimatePresence`** — плавный fade+slide при смене маршрута
- **`ErrorBoundary` + `Suspense`** — обработка ошибок и индикатор загрузки страниц
- **Подвал** — год, статус сервера, версия

### `PageMeta`

Компонент без UI — устанавливает мета-теги через `useEffect`:

- `document.title` → `"{Заголовок} | מרכז המדיה של ישראל"`
- `<meta name="description">`
- `<meta name="robots">` — `noindex, follow` для 404
- Open Graph теги: `og:title`, `og:description`, `og:url`, `og:image`, `og:locale`
- Twitter Card теги
- `<link rel="canonical">`
- `<link rel="alternate" hreflang="he">` и `hreflang="x-default"`
- `<script type="application/ld+json">` с схемой `WebPage`

Используется в каждой странице — вызывается с `title` и `description`.

### `ErrorBoundary`

React class-компонент. При ошибке рендера дочерних компонентов показывает UI с кнопкой «Попробовать снова». Сбрасывает состояние при клике. Логирует ошибки в `console.error`.

### `Logo`

SVG-логотип (`logo_play.png`) с вращением (`logo-spin` animation) и gradient glow при ховере. Принимает `className` для размера.

---

## Библиотека анимаций

Файл `src/lib/motion.ts` экспортирует готовые presets для Motion.js:

```typescript
// Константы viewport
viewportOnce          // { once: true, margin: '-80px' } — триггер при входе в область видимости

// Variants для whileInView / initial / animate
sectionVariants       // fade + slide-up для секций
containerStagger      // stagger-эффект для дочерних элементов (0.1s задержка)
cardVariants          // fade + slide-up для карточек
slideInLeft           // slide с левой стороны
slideInRight          // slide с правой стороны
scaleIn               // scale от 0.72 до 1

// Hover
cardHover             // y: -6, scale: 1.02 (spring)

// Утилита
scrollRevealMotion    // объект props для motion.div — скролл-ревил без конфликта с роутингом

// Хук
useAnimatedCounter(target, inView)  // анимирует число от 0 до target когда inView=true
```

**Правило `reduceMotion`**: все анимации в компонентах проверяют `useReducedMotion()`. При `prefers-reduced-motion: reduce` анимации отключаются.

---

## SEO

### Структура мета-тегов

Каждая страница содержит полный набор тегов:

```html
<!-- Базовые -->
<title>{Страница} | מרכז המדיה של ישראל</title>
<meta name="description" content="..." />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://media.moraltogether.com/{маршрут}" />

<!-- Open Graph -->
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:url" content="..." />
<meta property="og:image" content="https://media.moraltogether.com/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="he_IL" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />

<!-- hreflang -->
<link rel="alternate" hreflang="he" href="https://media.moraltogether.com/{маршрут}" />
<link rel="alternate" hreflang="x-default" href="https://media.moraltogether.com/" />

<!-- JSON-LD WebPage -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "...",
  "description": "...",
  "url": "...",
  "inLanguage": "he"
}
</script>
```

### JSON-LD на уровне сайта (index.html)

В `index.html` зашита схема `Organization`:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "מרכז המדיה של ישראל",
  "url": "https://media.moraltogether.com",
  "logo": "https://media.moraltogether.com/logo_play.png"
}
```

### Sitemap

`public/sitemap.xml` содержит все 5 маршрутов. При изменении контента обновляйте `<lastmod>`.

### Robots.txt

`public/robots.txt` — индексирование разрешено, путь к sitemap указан.

---

## Производительность

### Загрузка шрифтов

Шрифты Google Fonts (Assistant, Rubik) загружаются **без блокировки рендеринга**:

```html
<!-- Preconnect к CDN -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Preload манифеста шрифта -->
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?..." />

<!-- Неблокирующая загрузка: media=print → after load → media=all -->
<link rel="stylesheet" media="print" onload="this.media='all'" href="https://fonts.googleapis.com/css2?..." />

<!-- Fallback для no-JS -->
<noscript><link rel="stylesheet" href="..." /></noscript>
```

> **Важно:** В `index.css` нет `@import` для шрифтов — он был удалён, так как CSS `@import` блокирует рендеринг.

### Предотвращение CLS (Cumulative Layout Shift)

Hero-изображение `logo_text.png` имеет явные `width` и `height`:

```tsx
<img
  src="/logo_text.png"
  width={800}
  height={160}
  fetchPriority="high"
  alt="מרכז המדיה של ישראל"
/>
```

Браузер резервирует место до загрузки изображения → CLS = 0.

### GPU-ускорение aurora-орбов

Четыре blur-орба на главной странице получили `will-change: transform`, что переводит их в отдельный compositor layer и предотвращает перерасчёт layout при анимации:

```tsx
<motion.div style={{ x: o1x, y: o1y, willChange: 'transform' }} ... />
```

### Code splitting

Все страницы — lazy-loaded чанки. Layout и общие компоненты в основном бандле.

---

## Доступность (a11y)

| Функция | Реализация |
|---|---|
| Skip-link | `<a href="#main-content">` — видим при Tab-фокусе |
| `<main id="main-content">` | Целевой элемент skip-link |
| Текущий пункт меню | `aria-current="page"` на активной ссылке |
| Мобильное меню | `role="dialog"`, `aria-modal="true"`, `aria-label` |
| Focus trap | Цикличный Tab внутри открытого меню |
| Закрытие по Escape | Глобальный keydown-хендлер |
| Иконки | `aria-hidden="true"` на декоративных SVG |
| Логотип | `alt=""` (декоративный), контекст из текста ссылки |
| `prefers-reduced-motion` | Все Motion-анимации проверяют `useReducedMotion()` и отключаются |
| CSS media query | `@media (prefers-reduced-motion: reduce)` убирает CSS-анимации |
| Контрастность | Фоновые цвета и тексты соответствуют WCAG AA |

---

## Тестирование

### Конфигурация

- **Фреймворк:** Vitest 4 (встроен в Vite конфиг через `vitest/config`)
- **Окружение:** jsdom
- **Globals:** `describe`, `it`, `expect`, `vi` доступны без импорта
- **Setup-файл:** `src/test-setup.ts`

### Setup (`src/test-setup.ts`)

```typescript
import '@testing-library/jest-dom';

// Mock-классы для motion-зависимостей
class MockIntersectionObserver { ... }
class MockResizeObserver { ... }
vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
vi.stubGlobal('ResizeObserver', MockResizeObserver);

// matchMedia для useReducedMotion
Object.defineProperty(window, 'matchMedia', { ... });
```

> **Почему классы, а не `vi.fn()`:** Motion использует `new IntersectionObserver(...)` — функция-конструктор обязательна.

### Запуск тестов

```bash
# Однократный запуск
npm test

# Watch-режим (авто-перезапуск при изменениях)
npm run test:watch

# С отчётом покрытия кода
npm run test:coverage
```

### Покрытие (93 теста, 11 файлов)

| Файл | Кол-во тестов | Что проверяется |
|---|---|---|
| `utils.test.ts` | 7 | `cn()`: конфликты Tailwind, falsy-значения, массивы |
| `motion.test.ts` | 5 | `useAnimatedCounter`: состояние при inView false/true, без рестарта |
| `PageMeta.test.tsx` | 11 | Все мета-теги, canonical, robots, обновление при смене props |
| `ErrorBoundary.test.tsx` | 5 | Нормальный рендер, UI ошибки, логирование, кнопка retry |
| `Layout.test.tsx` | 13 | Навигация, footer, мобильное меню, aria, Escape, aria-current |
| `Home.test.tsx` | 11 | Hero, CTA-ссылки, статистика, карточки услуг |
| `AboutUs.test.tsx` | 7 | h1, статистика, миссия, ценности |
| `Services.test.tsx` | 10 | 6 карточек, теги технологий, описания |
| `Portfolio.test.tsx` | 12 | 6 проектов, категории, alt-тексты, кнопка «Смотреть» |
| `Contact.test.tsx` | 7 | mailto/tel ссылки, CTA, метки |
| `NotFound.test.tsx` | 5 | 404 текст, ссылка домой, noindex |

### Паттерн тестирования страниц

```typescript
function renderServices() {
  return render(
    <MemoryRouter initialEntries={['/services']}>
      <Routes>
        <Route path="/services" element={<Services />} />
      </Routes>
    </MemoryRouter>,
  );
}

it('renders exactly 6 service cards', () => {
  renderServices();
  expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(6);
});
```

---

## Сборка и деплой

### Локальная production-сборка

```bash
npm run build
# Результат в dist/
```

Скрипт `build` делает три шага:
1. `npm run og:image` — генерирует `public/og-image.png` через sharp
2. `vite build` — компилирует TypeScript, бандлит CSS и JS в `dist/`
3. `cp dist/index.html dist/404.html` — копирует SPA-шаблон как 404-страницу GitHub Pages (редиректы на SPA работают корректно)

### GitHub Pages (автоматический деплой)

Деплой настроен в `.github/workflows/deploy-pages.yml`:

- **Триггер:** push в ветку `main`
- **Шаги:** checkout → setup Node.js → `npm ci` → `npm run build` → deploy артефакта в GitHub Pages
- **Custom domain:** задан в `public/CNAME` (`media.moraltogether.com`)
- **`public/.nojekyll`** — отключает Jekyll-обработку (требуется для SPA)

### Base path

По умолчанию `base = "/"` (custom domain, корневой путь). Для деплоя в подпапку:

```bash
BASE_PATH="/my-subpath/" npm run build
```

---

## Переменные окружения

| Переменная | По умолчанию | Описание |
|---|---|---|
| `BASE_PATH` | `/` | Base URL сборки (передаётся в `vite.config.ts`) |

---

## Стилизация

### Tailwind CSS 4

Конфигурация через CSS (`src/index.css`) вместо `tailwind.config.js`:

```css
@import "tailwindcss";

@theme {
  --font-sans: "Assistant", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Rubik", ui-sans-serif, system-ui, sans-serif;
  --color-brand-neon: #00f2fe;
  --color-brand-pink: #ff0844;
  --color-brand-yellow: #fce803;
  --color-brand-green: #0cf574;
}
```

### CSS-переменные (`:root`)

```css
--background: #f8fafc;
--foreground: #0f172a;
--muted: #f1f5f9;
--muted-foreground: #64748b;
--card: #ffffff;
--border: #e2e8f0;
```

### Кастомные утилит-классы

| Класс | Эффект |
|---|---|
| `.text-gradient` | Радужный градиент (cyan → violet → pink → yellow) |
| `.text-gradient-tech` | Технологический градиент (blue → violet → pink) |
| `.text-gradient-cycling` | Анимированный градиент для cycling-лейбла в hero |
| `.text-gradient-vibrant` | Яркий градиент для тёмного фона |
| `.bg-gradient-neon` | Неоновый фоновый градиент |
| `.section-dot-grid` | Точечная сетка для фонов секций |
| `.section-light-mesh` | Mesh-градиент для светлых секций |
| `.btn-shimmer` | Эффект shimmer-блика при ховере на кнопку |
| `.logo-spin` | CSS-вращение логотипа (15s, ускоряется до 4s при ховере) |
| `.animate-float` | Плавающий эффект (floatY, 3.2s) |
| `.animate-glow-border` | Пульсирующее свечение рамки |

### Кастомный скроллбар

Градиентный scrollbar для WebKit-браузеров (Chrome, Safari, Edge). Цвета: зелёный → голубой → фиолетовый → красный → жёлтый.

---

## Рекомендации по развитию

- **Контактная форма** — заменить mailto-ссылку на реальную форму (Formspree, EmailJS или собственный backend). Текущие данные в `Contact.tsx` — плейсхолдеры.
- **CMS** — контент страниц (тексты, проекты, услуги) вынести в headless CMS (Sanity, Contentful) для управления без кода.
- **i18n** — добавить английскую версию через `react-i18next` при необходимости выхода на международный рынок.
- **E2E тесты** — добавить Playwright для проверки критических путей (главная → услуги → контакт).
- **Analytics** — подключить Google Analytics 4 или Plausible (privacy-first).
- **Service Worker** — добавить Workbox для offline-режима и ускорения повторных посещений.
