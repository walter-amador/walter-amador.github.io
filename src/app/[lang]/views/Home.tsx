/* eslint-disable @next/next/no-img-element */
import React, { FC } from 'react';
import techs from '@/dictionaries/techs.json';

// Resources
import MemojiSalut from '@root/public/memoji-salut.png';
import HomeBackgroundImg from '@root/public/home-bg.png';

// Libs
import { getDictionary } from '@/lib/dictionaries';

// Config
import { Locale } from '@root/i18n.config';

type HomeProps = {
  lang: Locale;
};

const Home: FC<HomeProps> = async ({ lang }) => {
  const {
    sections: { home },
  } = await getDictionary(lang);
  return (
    <section
      className='relative h-screen w-full flex flex-col justify-center items-center px-4'
      style={{
        backgroundImage: `url(${HomeBackgroundImg.src})`,
        backgroundSize: 'cover',
      }}
    >
      <div className='text-center h-5/6 flex flex-col justify-center items-center'>
        <p className='text-2xl md:text-4xl'>{home.salut}</p>
        <p className='text-4xl md:text-8xl font-black tracking-wider'>Walter Amador</p>
        <p className='text-2xl md:text-4xl font-bold tracking-wide'>{home.developer}</p>
      </div>
      <div className='h-1/6 w-full overflow-hidden'>
        <div className='flex space-x-4 animate-scrolling-text'>
          <ul className='flex whitespace-nowrap'>
            {techs.map((tech, index) => (
              <li key={index} className='m-4'>
                <span className='opacity-80 tracking-wider text-lg'>
                  {tech}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='absolute left-0 bottom-0'>
        <img src={MemojiSalut.src} className='size-36 md:size-[420px]' alt='Memoji of the author' loading='lazy' />
      </div>
    </section>
  );
};

export default Home;
