/* app.js — Main application */
'use strict';

/* ── DOM ─────────────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const searchForm   = $('searchForm');
const searchInput  = $('searchInput');
const suggestions  = $('suggestions');
const recentWrap   = $('recentWrap');
const recentChips  = $('recentChips');
const recentClear  = $('recentClear');
const loader       = $('loader');
const loaderText   = $('loaderText');
const errorCard    = $('errorCard');
const errorMsg     = $('errorMsg');
const apiPrompt    = $('apiPrompt');
const dashboard    = $('dashboard');
const sky          = $('sky');
const skyClouds    = $('skyClouds');

/* ── State ───────────────────────────────────────────────────── */
let useFahrenheit  = false;
let isDemoMode     = false;
let lastGeo        = null;
let lastData       = null;
let geocodeTimer   = null;

const STORAGE_KEY_API     = 'aether_api_key';
const STORAGE_KEY_RECENT  = 'aether_recent';
const STORAGE_KEY_UNIT    = 'aether_unit';
const RECENT_MAX          = 8;

/* ── Init ────────────────────────────────────────────────────── */
function init() {
  useFahrenheit = localStorage.getItem(STORAGE_KEY_UNIT) === 'F';
  updateUnitToggle();

  const savedKey = localStorage.getItem(STORAGE_KEY_API);
  if (savedKey) {
    WeatherAPI.setKey(savedKey);
    showApp();
    loadRecent();
    const params = new URLSearchParams(location.search);
    if (params.get('city')) loadCity(params.get('city'));
  } else {
    showApiPrompt();
  }
  initClouds();
}

/* ── API Key flow ────────────────────────────────────────────── */
function showApiPrompt() {
  apiPrompt.style.display = 'flex';
  dashboard.style.display = 'none';
}
function showApp() {
  apiPrompt.style.display = 'none';
}

$('apiKeyBtn').addEventListener('click', () => {
  const key = $('apiKeyInput').value.trim();
  if (!key) { alert('Please paste your API key.'); return; }
  localStorage.setItem(STORAGE_KEY_API, key);
  WeatherAPI.setKey(key);
  showApp();
  loadRecent();
});

$('apiDemoBtn').addEventListener('click', () => {
  isDemoMode = true;
  showApp();
  loadRecent();
  renderWeather(WeatherAPI.getDemoData('San Francisco'), true);
});

$('btnChangeKey').addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY_API);
  isDemoMode = false;
  dashboard.style.display = 'none';
  showApiPrompt();
});

/* ── Unit toggle ─────────────────────────────────────────────── */
$('unitToggle').addEventListener('click', () => {
  useFahrenheit = !useFahrenheit;
  localStorage.setItem(STORAGE_KEY_UNIT, useFahrenheit ? 'F' : 'C');
  updateUnitToggle();
  if (lastData) renderWeather(lastData, isDemoMode);
});

function updateUnitToggle() {
  $('unitC').className = 'unit-toggle__opt' + (!useFahrenheit ? ' unit-toggle__opt--active' : '');
  $('unitF').className = 'unit-toggle__opt' + ( useFahrenheit ? ' unit-toggle__opt--active' : '');
}

/* ── Temp conversion ─────────────────────────────────────────── */
function tempStr(c) {
  if (useFahrenheit) return Math.round(c * 9 / 5 + 32) + '°F';
  return Math.round(c) + '°C';
}
function tempDisplay(c) {
  if (useFahrenheit) return Math.round(c * 9 / 5 + 32) + '°';
  return Math.round(c) + '°';
}

/* ── Recent searches ─────────────────────────────────────────── */
function getRecent() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_RECENT) || '[]'); }
  catch { return []; }
}
function addRecent(city) {
  let list = getRecent().filter(c => c.toLowerCase() !== city.toLowerCase());
  list.unshift(city);
  list = list.slice(0, RECENT_MAX);
  localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(list));
  loadRecent();
}
function loadRecent() {
  const list = getRecent();
  if (list.length === 0) { recentWrap.style.display = 'none'; return; }
  recentWrap.style.display = 'flex';
  recentChips.innerHTML = '';
  list.forEach(city => {
    const btn = document.createElement('button');
    btn.className = 'recent-chip';
    btn.textContent = city;
    btn.type = 'button';
    btn.addEventListener('click', () => loadCity(city));
    recentChips.appendChild(btn);
  });
}
recentClear.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY_RECENT);
  loadRecent();
});

/* ── Search ──────────────────────────────────────────────────── */
searchInput.addEventListener('input', () => {
  const val = searchInput.value.trim();
  clearTimeout(geocodeTimer);
  if (!isDemoMode && val.length >= 2) {
    geocodeTimer = setTimeout(() => fetchSuggestions(val), 350);
  } else {
    hideSuggestions();
  }
});

async function fetchSuggestions(query) {
  if (!WeatherAPI.getKey()) return;
  try {
    const geos = await WeatherAPI.geocode(query);
    if (!geos || geos.length === 0) { hideSuggestions(); return; }
    suggestions.innerHTML = '';
    geos.forEach(g => {
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1a4 4 0 0 1 4 4c0 3-4 8-4 8S3 8 3 5a4 4 0 0 1 4-4z" stroke="currentColor" stroke-width="1.3"/><circle cx="7" cy="5" r="1.5" fill="currentColor"/></svg>
        <span>${g.name}${g.state ? ', ' + g.state : ''}, ${g.country}</span>`;
      li.addEventListener('click', () => {
        searchInput.value = g.name;
        hideSuggestions();
        lastGeo = g;
        fetchAndRender(g.lat, g.lon, `${g.name}, ${g.country}`);
      });
      suggestions.appendChild(li);
    });
    suggestions.style.display = 'block';
  } catch (_) { hideSuggestions(); }
}
function hideSuggestions() { suggestions.style.display = 'none'; }
document.addEventListener('click', e => { if (!searchForm.contains(e.target)) hideSuggestions(); });

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  const city = searchInput.value.trim();
  if (!city) return;
  if (isDemoMode) {
    renderWeather(WeatherAPI.getDemoData(city), true);
    addRecent(city);
    return;
  }
  loadCity(city);
});

async function loadCity(city) {
  hideSuggestions();
  showLoader(`Finding ${city}…`);
  try {
    const { geo } = await WeatherAPI.getByCity(city);
    lastGeo = geo;
    const label = `${geo.name}, ${geo.country}`;
    searchInput.value = geo.name;
    await fetchAndRender(geo.lat, geo.lon, label);
  } catch (err) {
    hideLoader();
    showError(err.message);
  }
}

async function fetchAndRender(lat, lon, label) {
  showLoader(`Loading weather for ${label}…`);
  try {
    const data = await WeatherAPI.getByCoords(lat, lon);
    lastData = data;
    hideLoader();
    renderWeather(data, false);
    addRecent(label);
    history.replaceState({}, '', `?city=${encodeURIComponent(label)}`);
  } catch (err) {
    hideLoader();
    showError(err.message);
  }
}

/* ── Geolocation ─────────────────────────────────────────────── */
$('btnLocation').addEventListener('click', () => {
  if (!navigator.geolocation) { showError('Geolocation not supported.'); return; }
  showLoader('Getting your location…');
  navigator.geolocation.getCurrentPosition(
    async pos => {
      const { latitude: lat, longitude: lon } = pos.coords;
      if (isDemoMode) {
        hideLoader(); renderWeather(WeatherAPI.getDemoData('Your Location'), true); return;
      }
      await fetchAndRender(lat, lon, 'Current Location');
    },
    () => { hideLoader(); showError('Location access denied. Please search manually.'); }
  );
});

/* ── Loader / Error ──────────────────────────────────────────── */
function showLoader(msg = 'Loading…') {
  loaderText.textContent = msg;
  loader.style.display   = 'flex';
  errorCard.style.display = 'none';
  dashboard.style.display = 'none';
}
function hideLoader() {
  loader.style.display = 'none';
}
function showError(msg) {
  errorMsg.textContent    = msg;
  errorCard.style.display = 'block';
  loader.style.display    = 'none';
}
$('errorRetry').addEventListener('click', () => {
  errorCard.style.display = 'none';
  if (lastGeo) fetchAndRender(lastGeo.lat, lastGeo.lon, lastGeo.name);
});

/* ── Render ──────────────────────────────────────────────────── */
function renderWeather(data, demo) {
  const { current, forecast } = data;
  const c = current;
  const now = c.dt;
  const isNight = now < c.sys.sunrise || now > c.sys.sunset;
  const code    = c.weather[0].id;

  dashboard.style.display = 'flex';

  // Sky atmosphere
  const sc = WeatherArt.skyClass(code, isNight);
  sky.className = 'sky ' + sc;

  // Panel mood
  const rightPanel = document.querySelector('.current-card__right');
  rightPanel.className = 'current-card__right ' + (isNight ? 'night' : code >= 500 && code < 700 ? 'rain' : code >= 200 && code < 300 ? 'thunder' : '');

  // Art
  $('weatherArt').innerHTML = WeatherArt.fromCode(code, isNight);

  // Profile
  const city    = demo ? c.name : c.name;
  const country = c.sys.country;
  $('curCity').textContent    = city;
  $('curCountry').textContent = country || '';
  $('curTemp').textContent    = tempDisplay(c.main.temp);
  $('curFeels').textContent   = tempStr(c.main.feels_like);
  $('curDesc').textContent    = c.weather[0].description;

  // Clock
  const localDate = new Date(now * 1000);
  $('curTime').textContent = localDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  $('curDate').textContent = localDate.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  // Details
  $('detailHumidity').textContent   = c.main.humidity + '%';
  $('detailWind').textContent       = (c.wind.speed * 3.6).toFixed(1) + ' km/h';
  $('detailVisibility').textContent = c.visibility >= 1000 ? (c.visibility / 1000).toFixed(1) + ' km' : c.visibility + 'm';
  $('detailPressure').textContent   = c.main.pressure + ' hPa';
  $('detailUV').textContent         = 'N/A';
  $('detailClouds').textContent     = (c.clouds?.all ?? 0) + '%';

  const fmtTime = ts => new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  $('detailSunrise').textContent = fmtTime(c.sys.sunrise);
  $('detailSunset').textContent  = fmtTime(c.sys.sunset);
  $('detailUpdated').textContent = fmtTime(now);

  // Extras
  const fc0 = forecast.list[0];
  $('extDew').textContent     = tempStr(c.main.humidity ? c.main.temp - (100 - c.main.humidity) / 5 : c.main.temp - 5);
  $('extMax').textContent     = tempStr(c.main.temp_max);
  $('extMin').textContent     = tempStr(c.main.temp_min);
  $('extGust').textContent    = c.wind.gust ? (c.wind.gust * 3.6).toFixed(1) + ' km/h' : '—';
  $('extWindDir').textContent = degToCompass(c.wind.deg);
  $('extPrecip').textContent  = fc0?.rain?.['3h'] ? fc0.rain['3h'].toFixed(1) + ' mm' : (fc0?.snow?.['3h'] ? fc0.snow['3h'].toFixed(1) + ' mm snow' : '0 mm');

  // Hourly
  renderHourly(forecast.list.slice(0, 12), isNight);

  // 5-day forecast
  renderForecast(forecast.list);

  // Document title
  document.title = `${tempStr(c.main.temp)} ${city} — Aether`;
}

/* ── Hourly ──────────────────────────────────────────────────── */
function renderHourly(list, baseIsNight) {
  const strip = $('hourlyStrip');
  strip.innerHTML = '';
  const nowTs = Math.floor(Date.now() / 1000);

  list.forEach((item, i) => {
    const d  = new Date(item.dt * 1000);
    const h  = d.getHours();
    const isN = h >= 20 || h < 6;
    const isCur = i === 0;

    const div = document.createElement('div');
    div.className = 'hourly-item' + (isCur ? ' current' : '');
    div.innerHTML = `
      <div class="hourly-item__time">${isCur ? 'Now' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      <div class="hourly-item__icon">${WeatherArt.toEmoji(item.weather[0].id, isN)}</div>
      <div class="hourly-item__temp">${tempDisplay(item.main.temp)}</div>
      ${item.pop > 0.1 ? `<div class="hourly-item__pop">💧 ${Math.round(item.pop * 100)}%</div>` : ''}
    `;
    strip.appendChild(div);
  });
}

/* ── 5-day forecast ──────────────────────────────────────────── */
function renderForecast(list) {
  const grid = $('forecastGrid');
  grid.innerHTML = '';

  // Group by day (take midday reading per day)
  const dayMap = new Map();
  list.forEach(item => {
    const d    = new Date(item.dt * 1000);
    const key  = d.toDateString();
    const hour = d.getHours();
    if (!dayMap.has(key) || Math.abs(hour - 12) < Math.abs(new Date(dayMap.get(key).dt * 1000).getHours() - 12)) {
      dayMap.set(key, item);
    }
  });

  // Min/max per day
  const minMax = new Map();
  list.forEach(item => {
    const key = new Date(item.dt * 1000).toDateString();
    const cur = minMax.get(key) || { min: Infinity, max: -Infinity };
    cur.min = Math.min(cur.min, item.main.temp_min);
    cur.max = Math.max(cur.max, item.main.temp_max);
    minMax.set(key, cur);
  });

  const days = [...dayMap.entries()].slice(0, 5);
  const absMax = Math.max(...[...minMax.values()].map(m => m.max));
  const absMin = Math.min(...[...minMax.values()].map(m => m.min));

  days.forEach(([key, item], i) => {
    const d    = new Date(item.dt * 1000);
    const mm   = minMax.get(key) || { min: item.main.temp_min, max: item.main.temp_max };
    const pct  = absMax !== absMin ? Math.round((mm.max - mm.min) / (absMax - absMin) * 100) : 60;
    const pop  = item.pop ? Math.round(item.pop * 100) : 0;
    const name = i === 0 ? 'Today' : d.toLocaleDateString([], { weekday: 'short' });

    const div = document.createElement('div');
    div.className = 'forecast-day';
    div.style.animationDelay = (0.05 * i) + 's';
    div.innerHTML = `
      <div class="forecast-day__name">${name}</div>
      <div class="forecast-day__icon">${WeatherArt.toEmoji(item.weather[0].id)}</div>
      <div class="forecast-day__desc">${item.weather[0].description}</div>
      <div class="forecast-day__temps">
        <span class="forecast-day__high">${tempDisplay(mm.max)}</span>
        <span class="forecast-day__low">${tempDisplay(mm.min)}</span>
      </div>
      <div class="forecast-day__bar-wrap">
        <div class="forecast-day__bar" style="width:${pct}%"></div>
      </div>
      ${pop > 10 ? `<div class="forecast-day__pop">💧 ${pop}%</div>` : ''}
    `;
    grid.appendChild(div);
  });
}

/* ── Clouds animation ────────────────────────────────────────── */
function initClouds() {
  skyClouds.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const c = document.createElement('div');
    c.className = 'sky__cloud';
    const size     = 80 + Math.random() * 160;
    const top      = 10 + Math.random() * 30;
    const duration = 60 + Math.random() * 80;
    const delay    = -Math.random() * duration;
    c.style.cssText = `
      width:${size}px; height:${size * .55}px;
      top:${top}vh; left:${-size}px;
      animation-duration:${duration}s;
      animation-delay:${delay}s;
      opacity:${0.3 + Math.random() * .3};
    `;
    skyClouds.appendChild(c);
  }
}

/* ── Helpers ─────────────────────────────────────────────────── */
function degToCompass(deg) {
  if (deg === undefined) return '—';
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

/* ── Boot ────────────────────────────────────────────────────── */
init();
