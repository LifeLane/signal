'use client';
import dynamic from 'next/dynamic';
import { Loader } from 'lucide-react';

const TradeVisionPageWithNoSSR = dynamic(
  () => import('@/components/tradevision/tradevision-page'),
  {
    ssr: false,
    loading: () => (
      <div className="h-dvh flex items-center justify-center bg-background">
        <Loader className="animate-spin" />
      </div>
    ),
  }
);

export default function Home() {
  return <TradeVisionPageWithNoSSR />;
}
