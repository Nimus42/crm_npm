import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Используем Inter с поддержкой кириллицы для чистого минималистичного вида
const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'CRM RushdDigital',
  description: 'Внутренняя CRM система агентства',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Принудительно включаем темную тему (класс dark)
    <html lang="ru" className="dark">
      <body className={`${inter.className} min-h-screen bg-neutral-950 text-neutral-100 flex flex-col`}>
        {children}
      </body>
    </html>
  );
}