// ページレベルの 'use cache' を外す → CityPage はリクエストごとに実行される
import { type ReactNode } from 'react';
import Link from 'next/link';
import { cacheLife } from 'next/cache';
import { CITIES, getCityById } from '@/constants/cities';
import {
  getWeather,
  getForecast,
  getWeatherDescription,
  getWeatherEmoji,
} from '@/lib/weather';
import { RevalidateButton } from '@/components/RevalidateButton';
import { CurrentTime } from '@/components/CurrentTime';
import { revalidateCityWeather } from '@/actions/weather';
import styles from './page.module.scss';

export async function generateStaticParams() {
  return CITIES.map((city) => ({ cityId: city.id }));
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ cityId: string }>;
}) {
  const { cityId } = await params;
  const city = getCityById(cityId);

  if (!city) {
    return <div>都市が見つかりません</div>;
  }

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>
        ← 一覧に戻る
      </Link>

      <div className={styles.header}>
        <h1 className={styles.title}>{city.name}の天気</h1>
        <RevalidateButton
          action={revalidateCityWeather.bind(null, city.id)}
          label="天気を更新"
        />
      </div>

      {/* 動的な表示: Client Component なのでキャッシュに含まれない */}
      <CurrentTime />

      {/*
        Interleaving パターン:
        キャッシュされた CachedWeatherSection の children として
        動的な情報を渡している。
        CachedWeatherSection は children を読まず pass-through するだけ。
      */}
      <CachedWeatherSection cityId={city.id} cityName={city.name}>
        <p className={styles.dynamicNote}>
          ↑ この天気データはキャッシュから表示 / ↓ これは動的
        </p>
      </CachedWeatherSection>
    </div>
  );
}

// キャッシュされるコンポーネント: 天気データの取得とレンダリングを担当
async function CachedWeatherSection({
  cityId,
  cityName,
  children,
}: {
  cityId: string;
  cityName: string;
  children: ReactNode;
}) {
  'use cache';
  cacheLife('forecast');

  console.log(`[CachedWeatherSection] レンダリング: ${cityName}`);

  const city = getCityById(cityId)!;

  const [weather, forecast] = await Promise.all([
    getWeather(city.latitude, city.longitude, city.id),
    getForecast(city.latitude, city.longitude),
  ]);

  return (
    <>
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

      {/* children は pass-through: キャッシュキーに影響しない */}
      {children}

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
    </>
  );
}
