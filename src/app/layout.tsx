import type { Metadata } from 'next';
import '@/styles/globals.css';
import { BackgroundWrapper } from '@/components/ui/BackgroundLayer';
import { SessionProvider } from '@/components/providers/SessionProvider';

export const metadata: Metadata = {
  title: 'Neoson — Assistentes Inteligentes',
  description: 'Plataforma de assistentes de IA da Straumann Group, powered by Amazon Bedrock AgentCore.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <SessionProvider>
          <BackgroundWrapper>{children}</BackgroundWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
