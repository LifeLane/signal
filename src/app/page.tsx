'use client';
import dynamic from 'next/dynamic';
import { Loader } from 'lucide-react';

const TradeVisionPage = dynamic(() => import('@/components/tradevision/tradevision-page'), {
  ssr: false,
  loading: () => (
    <div className="flex h-dvh items-center justify-center bg-background">
      <Loader className="h-10 w-10 animate-spin text-primary" />
    </div>
  ),
});

export default function Home() {
  return <TradeVisionPage />;
}
