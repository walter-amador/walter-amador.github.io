import React, { FC } from 'react';

import { Locale } from '@root/i18n.config';

import { getDictionary } from '@/lib/dictionaries';
import Carousel from '@/components/Carousel';
import TestimonialCard from '@/components/TestimonialCard';

type TestimonialsProps = {
  lang: Locale;
};

const Testimonials: FC<TestimonialsProps> = async ({ lang }) => {
  const {
    sections: { testimonials },
  } = await getDictionary(lang);
  return (
    <section className='relative h-screen w-full flex flex-col justify-center items-center px-4 space-y-6 text-light-secondary dark:text-dark-secondary '>
      <h2 className='text-6xl font-bold tracking-wider'>
        {testimonials.title}
      </h2>
      <p>{testimonials.description}</p>
      <Carousel Component={TestimonialCard} items={testimonials.references} />
      <a
        href={testimonials.referenceLink}
        target='_blank'
        rel='noopener noreferrer'
        className='text-blue-500 underline hover:text-blue-700'
      >
        {testimonials.referenceLinkText}
      </a>
    </section>
  );
};

export default Testimonials;
