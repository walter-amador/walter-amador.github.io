import React, { FC } from 'react';

import { Locale } from '@root/i18n.config';

import { getDictionary } from '@/lib/dictionaries';

type ExperienceProps = {
  lang: Locale;
};

const Experience: FC<ExperienceProps> = async ({ lang }) => {
  const {
    sections: { home },
  } = await getDictionary(lang);
  return (
    <section className='relative h-screen w-full flex flex-col justify-center items-center px-4'></section>
  );
};

export default Experience;
