import { cacheLife, cacheTag } from 'next/cache';

export type CurrentWeather = {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
};

export type WeatherResponse = {
  latitude: number;
  longitude: number;
  current: CurrentWeather;
};

export type DailyForecast = {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
};

export type ForecastResponse = {
  daily: DailyForecast[];
};

// WMO Weather interpretation codes
// https://open-meteo.com/en/docs
const WEATHER_DESCRIPTIONS: Record<number, string> = {
  0: '快晴',
  1: '晴れ',
  2: '一部曇り',
  3: '曇り',
  45: '霧',
  48: '着氷性の霧',
  51: '弱い霧雨',
  53: '霧雨',
  55: '強い霧雨',
  61: '弱い雨',
  63: '雨',
  65: '強い雨',
  71: '弱い雪',
  73: '雪',
  75: '強い雪',
  80: '弱いにわか雨',
  81: 'にわか雨',
  82: '強いにわか雨',
  95: '雷雨',
  96: '雹を伴う雷雨',
  99: '強い雹を伴う雷雨',
};

export function getWeatherDescription(code: number): string {
  return WEATHER_DESCRIPTIONS[code] ?? '不明';
}

const WEATHER_EMOJIS: Record<number, string> = {
  0: '☀️',
  1: '🌤',
  2: '⛅',
  3: '☁️',
  45: '🌫',
  48: '🌫',
  51: '🌦',
  53: '🌧',
  55: '🌧',
  61: '🌧',
  63: '🌧',
  65: '🌧',
  71: '🌨',
  73: '🌨',
  75: '❄️',
  80: '🌦',
  81: '🌧',
  82: '🌧',
  95: '⛈',
  96: '⛈',
  99: '⛈',
};

export function getWeatherEmoji(code: number): string {
  return WEATHER_EMOJIS[code] ?? '❓';
}

// 計測用ラッパー: use cache の外側で時間を計測する
export async function getWeatherWithTiming(
  cityName: string,
  latitude: number,
  longitude: number,
): Promise<WeatherResponse> {
  const start = performance.now();
  const result = await getWeather(latitude, longitude);
  const elapsed = performance.now() - start;
  console.log(`[WeatherCard] ${cityName}: ${elapsed.toFixed(0)}ms`);
  return result;
}

export async function getWeather(
  latitude: number,
  longitude: number,
  cityId?: string,
): Promise<WeatherResponse> {
  'use cache';
  cacheLife('weather');
  cacheTag('weather', cityId ? `weather-${cityId}` : 'weather-unknown');

  console.log(`[getWeather] API呼び出し: lat=${latitude}, lon=${longitude}`);

  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(latitude));
  url.searchParams.set('longitude', String(longitude));
  url.searchParams.set(
    'current',
    'temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m',
  );
  url.searchParams.set('timezone', 'Asia/Tokyo');

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`Weather API error: ${res.status}`);
  }

  const data = await res.json();

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    current: {
      temperature: data.current.temperature_2m,
      weatherCode: data.current.weather_code,
      windSpeed: data.current.wind_speed_10m,
      humidity: data.current.relative_humidity_2m,
    },
  };
}

// 週間予報の取得（use cache なし: ページレベルのキャッシュに含まれる）
export async function getForecast(
  latitude: number,
  longitude: number,
): Promise<ForecastResponse> {
  console.log(
    `[getForecast] API呼び出し: lat=${latitude}, lon=${longitude}`,
  );

  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(latitude));
  url.searchParams.set('longitude', String(longitude));
  url.searchParams.set(
    'daily',
    'temperature_2m_max,temperature_2m_min,weather_code',
  );
  url.searchParams.set('timezone', 'Asia/Tokyo');
  url.searchParams.set('forecast_days', '7');

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`Forecast API error: ${res.status}`);
  }

  const data = await res.json();

  return {
    daily: data.daily.time.map((date: string, i: number) => ({
      date,
      maxTemp: data.daily.temperature_2m_max[i],
      minTemp: data.daily.temperature_2m_min[i],
      weatherCode: data.daily.weather_code[i],
    })),
  };
}
