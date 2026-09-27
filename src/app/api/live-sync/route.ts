import { NextResponse } from 'next/server';
import { LiveFeedCrawler } from '@/services/liveFeedCrawler';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await LiveFeedCrawler.fetchRealFeeds();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Sync failed',
      },
      { status: 500 }
    );
  }
}
