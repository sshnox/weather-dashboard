/* weather-art.js — SVG weather illustrations */
'use strict';

window.WeatherArt = (() => {
  const arts = {

    sunny: `<svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="70" cy="70" r="28" fill="#FFC848" opacity=".95"/>
      <circle cx="70" cy="70" r="36" fill="#FFD760" opacity=".25"/>
      <circle cx="70" cy="70" r="44" fill="#FFE87A" opacity=".12"/>
      <g stroke="#FFC848" stroke-width="3.5" stroke-linecap="round">
        <line x1="70" y1="16" x2="70" y2="8"/>
        <line x1="70" y1="132" x2="70" y2="124"/>
        <line x1="16" y1="70" x2="8" y2="70"/>
        <line x1="132" y1="70" x2="124" y2="70"/>
        <line x1="29.9" y1="29.9" x2="24.2" y2="24.2"/>
        <line x1="115.8" y1="115.8" x2="110.1" y2="110.1"/>
        <line x1="110.1" y1="29.9" x2="115.8" y2="24.2"/>
        <line x1="24.2" y1="115.8" x2="29.9" y2="110.1"/>
      </g>
    </svg>`,

    'partly-cloudy': `<svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="55" cy="60" r="22" fill="#FFC848" opacity=".9"/>
      <g stroke="#FFC848" stroke-width="2.5" stroke-linecap="round" opacity=".7">
        <line x1="55" y1="30" x2="55" y2="24"/>
        <line x1="55" y1="90" x2="55" y2="84"/>
        <line x1="25" y1="60" x2="19" y2="60"/>
        <line x1="85" y1="60" x2="79" y2="60"/>
        <line x1="34.4" y1="39.4" x2="30.1" y2="35.1"/>
        <line x1="75.9" y1="80.9" x2="79.9" y2="84.9"/>
        <line x1="75.9" y1="39.4" x2="79.9" y2="35.1"/>
      </g>
      <ellipse cx="80" cy="90" rx="34" ry="22" fill="white" opacity=".95"/>
      <ellipse cx="60" cy="96" rx="28" ry="18" fill="white" opacity=".95"/>
      <ellipse cx="80" cy="90" rx="34" ry="22" fill="none" stroke="#e0e8f4" stroke-width="1.5"/>
      <ellipse cx="90" cy="84" rx="22" ry="18" fill="white"/>
    </svg>`,

    cloudy: `<svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="85" cy="58" rx="30" ry="24" fill="#c8d8ee"/>
      <ellipse cx="60" cy="68" rx="36" ry="26" fill="#dce8f5"/>
      <ellipse cx="85" cy="58" rx="30" ry="24" fill="white" opacity=".5"/>
      <ellipse cx="60" cy="68" rx="36" ry="26" fill="white" opacity=".7"/>
      <ellipse cx="90" cy="78" rx="38" ry="24" fill="white" opacity=".9"/>
      <ellipse cx="58" cy="84" rx="34" ry="22" fill="white"/>
      <ellipse cx="90" cy="78" rx="38" ry="24" fill="none" stroke="#c8d8ee" stroke-width="1.5"/>
    </svg>`,

    rain: `<svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="85" cy="48" rx="28" ry="22" fill="#aabcd4"/>
      <ellipse cx="58" cy="56" rx="34" ry="22" fill="#b8cde0"/>
      <ellipse cx="88" cy="62" rx="36" ry="20" fill="#c0d2e8"/>
      <ellipse cx="62" cy="64" rx="30" ry="18" fill="#c8d8ee"/>
      <g stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round" opacity=".8">
        <line x1="52" y1="88" x2="46" y2="104"/>
        <line x1="66" y1="90" x2="60" y2="106"/>
        <line x1="80" y1="88" x2="74" y2="104"/>
        <line x1="94" y1="86" x2="88" y2="102"/>
        <line x1="59" y1="104" x2="53" y2="120"/>
        <line x1="73" y1="106" x2="67" y2="122"/>
        <line x1="87" y1="102" x2="81" y2="118"/>
      </g>
    </svg>`,

    'heavy-rain': `<svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="85" cy="44" rx="28" ry="20" fill="#8aa0bc"/>
      <ellipse cx="56" cy="52" rx="34" ry="22" fill="#96aec8"/>
      <ellipse cx="88" cy="58" rx="36" ry="20" fill="#a0b4cc"/>
      <ellipse cx="60" cy="60" rx="32" ry="18" fill="#aabcd4"/>
      <g stroke="#4ea8de" stroke-width="2.8" stroke-linecap="round" opacity=".9">
        <line x1="44" y1="80" x2="36" y2="100"/>
        <line x1="58" y1="82" x2="50" y2="102"/>
        <line x1="72" y1="80" x2="64" y2="100"/>
        <line x1="86" y1="78" x2="78" y2="98"/>
        <line x1="100" y1="76" x2="92" y2="96"/>
        <line x1="51" y1="100" x2="43" y2="120"/>
        <line x1="65" y1="102" x2="57" y2="122"/>
        <line x1="79" y1="98" x2="71" y2="118"/>
        <line x1="93" y1="96" x2="85" y2="116"/>
      </g>
    </svg>`,

    thunder: `<svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="85" cy="44" rx="28" ry="20" fill="#7080a0"/>
      <ellipse cx="56" cy="52" rx="34" ry="22" fill="#7888a8"/>
      <ellipse cx="88" cy="58" rx="36" ry="20" fill="#8090ac"/>
      <ellipse cx="60" cy="60" rx="32" ry="18" fill="#8898b0"/>
      <path d="M72 66L60 90h14l-12 26 28-34H68l16-16z" fill="#FFD700" stroke="#FFC400" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M72 66L60 90h14l-12 26 28-34H68l16-16z" fill="#FFE040" opacity=".4"/>
    </svg>`,

    snow: `<svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="85" cy="50" rx="28" ry="22" fill="#d4dff0"/>
      <ellipse cx="58" cy="58" rx="34" ry="22" fill="#dce8f5"/>
      <ellipse cx="88" cy="64" rx="36" ry="20" fill="#e4eef8"/>
      <ellipse cx="62" cy="66" rx="30" ry="18" fill="#eaf2fc"/>
      <g fill="#90b8e0" opacity=".85">
        <text x="47" y="90" font-size="16" text-anchor="middle">❄</text>
        <text x="70" y="92" font-size="14" text-anchor="middle">❄</text>
        <text x="93" y="88" font-size="13" text-anchor="middle">❄</text>
        <text x="58" y="110" font-size="15" text-anchor="middle">❄</text>
        <text x="82" y="108" font-size="12" text-anchor="middle">❄</text>
      </g>
    </svg>`,

    fog: `<svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#a0b4cc" stroke-width="4" stroke-linecap="round" opacity=".6">
        <line x1="20" y1="55" x2="120" y2="55"/>
        <line x1="30" y1="70" x2="110" y2="70"/>
        <line x1="20" y1="85" x2="120" y2="85"/>
        <line x1="30" y1="100" x2="110" y2="100"/>
      </g>
      <g stroke="#b8c8d8" stroke-width="3" stroke-linecap="round" opacity=".4">
        <line x1="25" y1="47" x2="115" y2="47"/>
        <line x1="25" y1="108" x2="115" y2="108"/>
      </g>
    </svg>`,

    night: `<svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="72" cy="66" r="30" fill="#c8d0e8" opacity=".15"/>
      <path d="M84 42C68 42 55 55 55 71s13 29 29 29c8 0 15-3 20-8-2 0-4 .5-6 .5C83 92.5 70 79.5 70 63.5c0-10 5-18.5 14-21.5z" fill="#c8d0e8" opacity=".9"/>
      <circle cx="38" cy="38" r="2" fill="white" opacity=".7"/>
      <circle cx="108" cy="32" r="1.5" fill="white" opacity=".6"/>
      <circle cx="52" cy="24" r="1.2" fill="white" opacity=".5"/>
      <circle cx="120" cy="58" r="1.8" fill="white" opacity=".7"/>
      <circle cx="22" cy="66" r="1.3" fill="white" opacity=".5"/>
      <circle cx="98" cy="112" r="1.5" fill="white" opacity=".4"/>
      <circle cx="32" cy="100" r="1" fill="white" opacity=".5"/>
    </svg>`,

    'night-rain': `<svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M78 36C62 36 49 49 49 65c0 5 1.5 9.5 4 13.5" stroke="#8090b0" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <ellipse cx="80" cy="62" rx="32" ry="22" fill="#4a5570" opacity=".8"/>
      <ellipse cx="60" cy="68" rx="28" ry="18" fill="#556078"/>
      <g stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round" opacity=".8">
        <line x1="50" y1="92" x2="44" y2="108"/>
        <line x1="64" y1="94" x2="58" y2="110"/>
        <line x1="78" y1="92" x2="72" y2="108"/>
        <line x1="92" y1="90" x2="86" y2="106"/>
        <line x1="57" y1="110" x2="51" y2="126"/>
        <line x1="71" y1="110" x2="65" y2="126"/>
      </g>
    </svg>`,

  };

  function get(condition, isNight = false) {
    if (isNight && condition === 'clear') return arts.night;
    if (isNight && condition === 'rain')  return arts['night-rain'];
    return arts[condition] || arts.sunny;
  }

  // Map OWM condition codes → art keys
  function fromCode(code, isNight = false) {
    if (code >= 200 && code < 300) return get('thunder',       isNight);
    if (code >= 300 && code < 400) return get('rain',          isNight);
    if (code >= 500 && code < 502) return get('rain',          isNight);
    if (code >= 502 && code < 600) return get('heavy-rain',    isNight);
    if (code >= 600 && code < 700) return get('snow',          isNight);
    if (code >= 700 && code < 800) return get('fog',           isNight);
    if (code === 800)               return get('clear',         isNight);
    if (code === 801)               return get('partly-cloudy', isNight);
    if (code === 802)               return get('partly-cloudy', isNight);
    if (code >= 803)                return get('cloudy',        isNight);
    return get('sunny', isNight);
  }

  // Map codes to emoji (for hourly/forecast cards)
  function toEmoji(code, isNight = false) {
    if (code >= 200 && code < 300) return '⛈';
    if (code >= 300 && code < 400) return '🌦';
    if (code >= 500 && code < 600) return '🌧';
    if (code >= 600 && code < 700) return '❄️';
    if (code >= 700 && code < 800) return '🌫';
    if (code === 800) return isNight ? '🌙' : '☀️';
    if (code === 801) return isNight ? '🌤' : '🌤';
    if (code === 802) return '⛅';
    if (code >= 803) return '☁️';
    return '🌡';
  }

  // Sky background class from code
  function skyClass(code, isNight) {
    if (isNight) return 'sky--night';
    if (code >= 200 && code < 300) return 'sky--thunder';
    if (code >= 300 && code < 700) return 'sky--rain';
    return '';
  }

  return { fromCode, toEmoji, skyClass };
})();
