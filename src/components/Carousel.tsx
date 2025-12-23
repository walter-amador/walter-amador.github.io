'use client';
// Carousel component created with react, typescript and tailwindcss and doesn't have any dependencies.

import React, { FC, useState, useEffect, useRef } from 'react';

type CarouselProps = {
  items: any[];
  Component: FC<any>;
};

const Carousel: FC<CarouselProps> = ({ items, Component }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + items.length) % items.length
    );
  };

  return (
    <div className='relative w-full overflow-hidden'>
      <div
        className='flex transition-transform duration-700 ease-in-out w-screen ms-[-1rem]'
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className='flex justify-center items-center w-full flex-shrink-0'
            style={{ width: '100vw' }}
          >
            <Component key={index} {...item} />
          </div>
        ))}
      </div>
      <div className='flex justify-center items-center w-full'>
        {items.map((item, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full mx-2 cursor-pointer duration-700 ease-in-out ${
              currentSlide === index ? 'bg-gray-800' : 'bg-gray-400'
            }`}
            onClick={() => setCurrentSlide(index)}
          ></div>
        ))}
      </div>

      <button
        className='absolute top-1/2 left-0 transform -translate-y-1/2 px-4 py-2 bg-gray-800 text-white'
        onClick={prevSlide}
      >
        Prev
      </button>
      <button
        className='absolute top-1/2 right-0 transform -translate-y-1/2 px-4 py-2 bg-gray-800 text-white'
        onClick={nextSlide}
      >
        Next
      </button>
    </div>
  );
};

export default Carousel;
