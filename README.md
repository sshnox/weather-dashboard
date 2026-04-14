# 🌤 Aether — Weather Dashboard

> A beautiful weather dashboard using OpenWeatherMap API. Shows current conditions, hourly strip, 5-day forecast, and atmospheric details. Stores recent searches.

---

## ✨ Features

- **Current weather** — temperature, feels like, description, humidity, wind, visibility, pressure, cloud cover
- **Sunrise & sunset** — times displayed in local format
- **Hourly forecast** — 12-hour strip with emoji, temp, precipitation chance
- **5-day forecast** — high/low, condition, visual temp bar, precip %
- **Air & atmosphere** — dew point, wind gust, wind direction, precipitation
- **City search** — live autocomplete via geocoding API
- **Recent searches** — stored in localStorage, click to reload
- **°C / °F toggle** — persisted in localStorage
- **Use my location** — geolocation API support
- **Dynamic sky** — background and weather illustration changes with conditions (rain, night, thunder, clouds)
- **Demo mode** — try the app without an API key
- **URL sharing** — `?city=Tokyo` deep links work

---

## 🔑 API Key Setup

1. Register free at [openweathermap.org](https://openweathermap.org/api)
2. Go to **API Keys** in your account dashboard
3. Copy your key — it activates within **10 minutes**
4. Open the app and paste it in the prompt

> The free tier supports 1,000 calls/day — more than enough for personal use.
> Your key is stored only in your browser's `localStorage`.

---

## 🚀 Deploy to GitHub Pages

1. Extract the zip → push to a new GitHub repo
2. **Settings → Pages → Source: main branch → Save**
3. Live at: `https://YOUR_USERNAME.github.io/weather-dashboard`

Or open `index.html` directly — works locally too.

---

## 🗂 Project Structure

```
weather-dashboard/
├── index.html              ← App shell
├── css/style.css           ← Soft atmospheric theme
├── js/
│   ├── weather-art.js      ← SVG weather illustrations + emoji map
│   ├── api.js              ← OWM API wrapper + demo data
│   └── app.js              ← Main application
└── README.md
```

---

## ⌨️ URL Parameters

```
?city=London
?city=Tokyo,JP
?city=New+York,US
```

---

## License

MIT © 2024
