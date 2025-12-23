import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Locale, i18n } from '@root/i18n.config';
import Navbar from '@/components/Navbar';
import { FC } from 'react';

const poppins = Poppins({ weight: ['400', '600', '800'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Walter Amador Portfolio',
  description: 'Walter Amador Portfolio as a Full Stack Developer',
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

type RootLayoutProps = {
  children: React.ReactNode;
  params: { lang: Locale };
};

const RootLayout: FC<RootLayoutProps> = ({ children, params }) => {
  return (
    <html lang={params.lang}>
      <body className={`${poppins.className} dark`}>
        <Navbar lang={params.lang} />
        {children}
        <footer></footer>
      </body>
    </html>
  );
};

export default RootLayout;
