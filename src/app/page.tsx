'use client';
import dynamic from 'next/dynamic';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
        <div className="h-dvh flex items-center justify-center bg-background">
            <Loader className="animate-spin" />
        </div>
    );
  }

  return <TradeVisionPageWithNoSSR />;
}
