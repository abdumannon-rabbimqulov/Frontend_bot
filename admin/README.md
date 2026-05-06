# Logistika AI — Admin Panel (Vite + React)

Admin SPA — `Frontend_bot/admin/`.

## Stack

- React 18 + Vite
- TailwindCSS
- React Router 6
- TanStack Query
- react-i18next (uz / uz_cyrl / ru)
- Leaflet + react-leaflet (live driver map)
- Recharts (dashboard chart)

## Scripts

```bash
cd Frontend_bot/admin
npm install
npm run dev          # http://localhost:5174/admin/
npm run build        # -> dist/
```

## Auth

Login faqat Telegram WebApp orqali. Admin panelni `https://t.me/<bot>/admin`
WebApp tugmasidan ochish kerak — `window.Telegram.WebApp.initData` avtomatik
`POST /auth/login` ga yuboriladi va JWT olinadi. Foydalanuvchi `role == ADMIN`
yoki ID env'dagi `ADMIN_IDS` ichida bo'lishi shart, aks holda kirish rad etiladi.

## API base

`VITE_API_BASE` env (default `/api` — nginx/Vite proxy orqali). Dev'da Vite
`/api/*` ni `http://localhost:8000/*` ga rewrite qiladi.

Muhim: admin SPA sahifalari `/admin/users`, `/admin/orders` kabi route'larda
ochiladi. Backend API esa frontenddan `/api/admin/users`, `/api/admin/orders`
ko'rinishida chaqiriladi, shunda real sahifalar va API path'lari aralashmaydi.

## Nginx (prod)

Admin SPA `/admin/` location'iga ulanadi. Misol:

```nginx
location /admin/ {
    alias /var/www/Frontend_bot/admin/dist/;
    try_files $uri $uri/ /admin/index.html;
}
```

## Tillar

`src/i18n/{uz,uz_cyrl,ru}.json` — bir xil kalitlar bilan tarjimalar; switcher
yuqori panelning o'ng burchagida.
