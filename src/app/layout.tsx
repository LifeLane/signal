
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { WalletProvider } from './wallet-provider';
import '@solana/wallet-adapter-react-ui/styles.css';
import ClientOnly from '@/components/tradevision/client-only';
import { ThemeProvider } from '@/components/tradevision/theme-provider';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'SHADOW',
  description: 'AI Trading Analysis Tool',
};

const themes = [
    'dark',
    'theme-neural-pulse',
    'theme-solar-flare',
    'theme-quantum-neon',
    'theme-abyssal-ocean',
    'theme-synthwave-sunset',
    'theme-crimson-cipher',
    'theme-gilded-serpent',
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
         <Script id="theme-switcher" strategy="beforeInteractive">
          {`
            (function() {
              const themes = ['dark', 'theme-neural-pulse', 'theme-solar-flare', 'theme-quantum-neon', 'theme-abyssal-ocean', 'theme-synthwave-sunset', 'theme-crimson-cipher', 'theme-gilded-serpent'];
              const randomTheme = themes[Math.floor(Math.random() * themes.length)];
              document.documentElement.className = randomTheme;
            })();
          `}
        </Script>
      </head>
      <body className="font-sans antialiased bg-background" suppressHydrationWarning>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
            themes={themes}
        >
            <ClientOnly>
                <WalletProvider>
                    <div className="relative mx-auto max-w-sm h-dvh overflow-hidden border-x border-border/20">
                        {children}
                    </div>
                    <Toaster />
                </WalletProvider>
            </ClientOnly>
        </ThemeProvider>
      </body>
    </html>
  );
}

    