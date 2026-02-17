import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    // 天気の現在情報用: 短めのキャッシュ
    weather: {
      stale: 60, // クライアント側: 60秒間はキャッシュをそのまま使う
      revalidate: 120, // サーバー側: 120秒後にバックグラウンドで再検証
      expire: 300, // 300秒（5分）経過したら完全に期限切れ
    },
    // 週間予報用: 少し長めのキャッシュ（STEP 4以降で使用）
    forecast: {
      stale: 300, // クライアント側: 5分
      revalidate: 3600, // サーバー側: 1時間
      expire: 86400, // 24時間
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              dimensions: false,
            },
          },
        ],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
