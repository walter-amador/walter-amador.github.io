/* eslint-disable @next/next/no-img-element */
import React, { FC } from 'react';

import { Locale } from '@root/i18n.config';

import { getDictionary } from '@/lib/dictionaries';

import AboutBackgroundImg from '@root/public/about-bg.png';
import MemojiThumbUp from '@root/public/memoji-thumb-up.png';

type AboutProps = {
  lang: Locale;
};

const About: FC<AboutProps> = async ({ lang }) => {
  const {
    sections: { about },
  } = await getDictionary(lang);
  return (
    <section
      className='relative w-full flex flex-col justify-center items-center px-4 py-12'
      style={{
        backgroundImage: `url(${AboutBackgroundImg.src})`,
        backgroundSize: 'cover',
      }}
    >
      <div className='flex items-stretch space-x-8 px-36'>
        <div className='flex items-center bg-dark-primary bg-opacity-80 rounded-xl shadow-lg text-dark-secondary p-4 max-w-2xl space-x-8'>
          <p>{about.description}</p>
          <img src={MemojiThumbUp.src} alt='Memoji thumbs up' className='size-48' />
        </div>
        <div className='flex flex-col justify-between space-y-4 h-full'>
            <div className='bg-light-primary rounded-xl shadow-lg p-4 text-light-secondary font-bold flex-1 flex justify-center'>
                <p className='w-full text-center m-auto'>{about.principle1}</p>
            </div>
            <div className='bg-light-primary rounded-xl shadow-lg p-4 text-light-secondary font-bold flex-1 flex justify-center'>
                <p className='w-full text-center m-auto'>{about.principle2}</p>
            </div>
            <div className='bg-light-primary rounded-xl shadow-lg p-4 text-light-secondary font-bold flex-1 flex justify-center'>
                <p className='w-full text-center m-auto'>{about.principle3}</p>
            </div>
        </div>
      </div>
    </section>
  );
};

export default About;
