import Link from 'next/link';
import { CITIES } from '@/constants/cities';
import { WeatherCard } from '@/components/WeatherCard';
import styles from './page.module.scss';

export default async function Page() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>天気ダッシュボード</h1>
      <p className={styles.description}>
        Open Meteo API × use cache 学習アプリ
      </p>
      <div className={styles.grid}>
        {CITIES.map((city) => (
          <Link
            key={city.id}
            href={`/city/${city.id}`}
            className={styles.cardLink}
          >
            <WeatherCard
              cityId={city.id}
              cityName={city.name}
              latitude={city.latitude}
              longitude={city.longitude}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
