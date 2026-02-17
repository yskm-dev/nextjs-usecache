import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag');

  if (!tag) {
    return NextResponse.json(
      {
        error: 'tag パラメータが必要です',
        usage: '/api/revalidate?tag=weather',
        examples: [
          '/api/revalidate?tag=weather          → 全都市の天気キャッシュを破棄',
          '/api/revalidate?tag=weather-tokyo     → 東京の天気データのみ破棄',
          '/api/revalidate?tag=weather-card      → 全都市のカードコンポーネントを破棄',
          '/api/revalidate?tag=weather-card-tokyo → 東京のカードコンポーネントのみ破棄',
        ],
      },
      { status: 400 },
    );
  }

  // 第2引数 'max': stale-while-revalidate でキャッシュを破棄（推奨）
  // { expire: 0 } を渡すと即座に期限切れにできる
  revalidateTag(tag, 'max');

  return NextResponse.json({
    revalidated: true,
    tag,
    timestamp: new Date().toISOString(),
  });
}
