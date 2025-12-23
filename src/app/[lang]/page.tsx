import React, { FC } from 'react';

// Config
import { Locale } from '@root/i18n.config';

// Views
import Home from './views/Home';
import About from './views/About';
import Experience from './views/Experience';
import Testimonials from './views/Testimonials';

interface LandingPageProps {
  params: {
    lang: Locale;
  };
}

const LandingPage: FC<LandingPageProps> = ({ params: { lang } }) => {
  return (
    <main className='w-full bg-light-primary dark:bg-dark-primary text-light-secondary dark:text-dark-secondary'>
      <Home lang={lang} />
      <Experience lang={lang} />
      <About lang={lang} />
      <Testimonials lang={lang} />
    </main>
  );
};

export default LandingPage;
