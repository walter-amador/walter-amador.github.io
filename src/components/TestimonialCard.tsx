/* eslint-disable @next/next/no-img-element */
'use client';
import { FC } from 'react';
import QuoteIcon from './Icons/QuoteIcon';

const TestimonialCard: FC<any> = ({ name, title, recommendation, imgLink }) => {
  return (
    <div className='rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 shadow-md flex flex-col w-1/3 h-96 items-center p-8 justify-between mb-4'>
      <div className='w-full'>
        <QuoteIcon width='52px' height='52px' color='#AAAAAA' />
      </div>
      <p className='w-full text-center'>{recommendation}</p>
      <div className='flex w-[80%] justify-between'>
        <div className='max-w-[70%]'>
          <p className='font-bold'>- {name}</p>
          <p>{title}</p>
        </div>
        <div className='rounded-full overflow-hidden border-4 border-light-primary'>
          <img src={imgLink} alt={`${name} linkedin image`} />
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
