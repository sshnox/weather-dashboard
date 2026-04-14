/* api.js — OpenWeatherMap API wrapper + demo data */
'use strict';

window.WeatherAPI = (() => {
  const BASE     = 'https://api.openweathermap.org/data/2.5';
  const GEO_BASE = 'https://api.openweathermap.org/geo/1.0';

  let _key = '';

  function setKey(key) { _key = key.trim(); }
  function getKey()    { return _key; }

  async function get(url) {
    const res = await fetch(url);
    if (res.status === 401) throw new Error('Invalid API key. Please check your OpenWeatherMap key.');
    if (res.status === 404) throw new Error('City not found. Try a different spelling or add the country code (e.g. "Paris, FR").');
    if (!res.ok)            throw new Error(`Weather API error (${res.status}). Try again shortly.`);
    return res.json();
  }

  async function geocode(city) {
    const data = await get(`${GEO_BASE}/direct?q=${encodeURIComponent(city)}&limit=5&appid=${_key}`);
    return data; // [{name, lat, lon, country, state}]
  }

  async function getCurrent(lat, lon) {
    return get(`${BASE}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${_key}`);
  }

  async function getForecast(lat, lon) {
    return get(`${BASE}/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=40&appid=${_key}`);
  }

  async function getByCity(city) {
    const geos = await geocode(city);
    if (!geos || geos.length === 0) throw new Error('City not found.');
    return { geo: geos[0], geoList: geos };
  }

  async function getByCoords(lat, lon) {
    const [current, forecast] = await Promise.all([
      getCurrent(lat, lon),
      getForecast(lat, lon),
    ]);
    return { current, forecast };
  }

  // ── Demo data ──────────────────────────────────────────────────
  function getDemoData(city = 'San Francisco') {
    const now  = Math.floor(Date.now() / 1000);
    const hr   = 3600;

    const current = {
      name: city, sys: { country: 'US', sunrise: now - 4 * hr, sunset: now + 6 * hr },
      coord: { lat: 37.77, lon: -122.42 },
      weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
      main: { temp: 18.4, feels_like: 17.2, temp_min: 14.0, temp_max: 21.5, pressure: 1015, humidity: 72 },
      wind: { speed: 4.2, deg: 270, gust: 6.5 },
      visibility: 10000, clouds: { all: 25 },
      dt: now,
    };

    const days   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const codes  = [801, 800, 500, 500, 803, 800, 801];
    const descs  = ['Few clouds','Sunny','Light rain','Showers','Overcast','Clear','Partly cloudy'];
    const highs  = [21.5, 23.0, 16.2, 15.8, 18.0, 24.5, 22.0];
    const lows   = [14.0, 15.5, 12.0, 11.5, 13.2, 16.0, 14.8];

    const forecastList = [];
    for (let d = 0; d < 5; d++) {
      for (let h = 0; h < 8; h++) {
        const t   = now + d * 24 * hr + h * 3 * hr;
        const i   = d % codes.length;
        forecastList.push({
          dt: t,
          main: {
            temp:     lows[i] + (highs[i] - lows[i]) * (h / 7),
            temp_min: lows[i],
            temp_max: highs[i],
            feels_like: lows[i] + (highs[i] - lows[i]) * (h / 7) - 1,
            humidity: 60 + d * 3,
            pressure: 1013,
          },
          weather: [{ id: codes[i], main: 'Clouds', description: descs[i], icon: '02d' }],
          wind: { speed: 3 + d, deg: 260 + d * 15 },
          pop: d === 2 || d === 3 ? 0.7 : 0.1,
          clouds: { all: 20 + d * 10 },
          visibility: 9000,
        });
      }
    }

    return {
      current,
      forecast: { list: forecastList, city: { name: city, country: 'US', sunrise: current.sys.sunrise, sunset: current.sys.sunset } },
    };
  }

  return { setKey, getKey, geocode, getByCity, getByCoords, getDemoData };
})();
