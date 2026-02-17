import { cacheLife, cacheTag } from 'next/cache';
import {
  getWeather,
  getWeatherDescription,
  getWeatherEmoji,
} from '@/lib/weather';
import styles from './WeatherCard.module.scss';

export async function WeatherCard({
  cityId,
  cityName,
  latitude,
  longitude,
}: {
  cityId: string;
  cityName: string;
  latitude: number;
  longitude: number;
}) {
  'use cache';
  cacheLife('weather');
  cacheTag('weather-card', `weather-card-${cityId}`);

  console.log(`[WeatherCard] レンダリング: ${cityName}`);

  const weather = await getWeather(latitude, longitude, cityId);

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>{cityName}</h2>
      <div className={styles.emoji}>
        {getWeatherEmoji(weather.current.weatherCode)}
      </div>
      <p className={styles.temperature}>{weather.current.temperature}°C</p>
      <p className={styles.weatherDescription}>
        {getWeatherDescription(weather.current.weatherCode)}
      </p>
      <div className={styles.details}>
        <span>💧 {weather.current.humidity}%</span>
        <span>💨 {weather.current.windSpeed} km/h</span>
      </div>
    </div>
  );
}
