import '@/styles/globals.scss';
import { Inter } from 'next/font/google';

const interFont = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'UseCache - yskm_dev',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
