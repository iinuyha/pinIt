import './globals.scss';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PinIt!', // 고정 타이틀
  description: 'pin_your_spot.', // 기본 설명
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <link rel='manifest' href='/manifest.json' />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
