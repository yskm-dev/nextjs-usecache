'use server';

import { revalidateTag } from 'next/cache';

// 特定都市の天気キャッシュを破棄する
export async function revalidateCityWeather(cityId: string) {
  console.log(`[Server Action] revalidateCityWeather: ${cityId}`);
  revalidateTag(`weather-${cityId}`, { expire: 0 });
  revalidateTag(`weather-card-${cityId}`, { expire: 0 });
}

// 全都市の天気キャッシュを破棄する
export async function revalidateAllWeather() {
  console.log('[Server Action] revalidateAllWeather');
  revalidateTag('weather', { expire: 0 });
  revalidateTag('weather-card', { expire: 0 });
}
