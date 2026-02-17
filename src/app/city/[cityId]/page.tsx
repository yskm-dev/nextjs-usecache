'use cache';

import Link from 'next/link';
import { cacheLife } from 'next/cache';
import { CITIES, getCityById } from '@/constants/cities';
import {
  getWeather,
  getForecast,
  getWeatherDescription,
  getWeatherEmoji,
} from '@/lib/weather';
import styles from './page.module.scss';

// 静的パラメータを生成（全都市分のページをビルド時に生成）
export async function generateStaticParams() {
  return CITIES.map((city) => ({ cityId: city.id }));
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ cityId: string }>;
}) {
  cacheLife('forecast');

  const { cityId } = await params;
  const city = getCityById(cityId);

  if (!city) {
    return <div>都市が見つかりません</div>;
  }

  const [weather, forecast] = await Promise.all([
    getWeather(city.latitude, city.longitude),
    getForecast(city.latitude, city.longitude),
  ]);

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>
        ← 一覧に戻る
      </Link>

      <h1 className={styles.title}>{city.name}の天気</h1>

      <section className={styles.current}>
        <div className={styles.emoji}>
          {getWeatherEmoji(weather.current.weatherCode)}
        </div>
        <p className={styles.temperature}>{weather.current.temperature}°C</p>
        <p className={styles.weatherDescription}>
          {getWeatherDescription(weather.current.weatherCode)}
        </p>
        <div className={styles.details}>
          <span>💧 湿度 {weather.current.humidity}%</span>
          <span>💨 風速 {weather.current.windSpeed} km/h</span>
        </div>
      </section>

      <section className={styles.forecastSection}>
        <h2 className={styles.forecastTitle}>週間予報</h2>
        <div className={styles.forecastGrid}>
          {forecast.daily.map((day) => (
            <div key={day.date} className={styles.forecastCard}>
              <p className={styles.forecastDate}>
                {new Date(day.date).toLocaleDateString('ja-JP', {
                  month: 'short',
                  day: 'numeric',
                  weekday: 'short',
                })}
              </p>
              <div className={styles.forecastEmoji}>
                {getWeatherEmoji(day.weatherCode)}
              </div>
              <p className={styles.forecastTemp}>
                <span className={styles.maxTemp}>{day.maxTemp}°</span>
                <span className={styles.minTemp}>{day.minTemp}°</span>
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
