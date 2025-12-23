'use client';
import React, { FC, useEffect, useState } from 'react';
import BurgerIcon from '../Icons/BurgerIcon';

type BurgerBtnProps = {
  translations: any;
};

const BurgerBtn: FC<BurgerBtnProps> = ({ translations }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <div className='md:hidden flex items-center px-2'>
      <button aria-label='burger' onClick={handleToggleDropdown}>
        <BurgerIcon width='32px' height='32px' />
      </button>
      {isDropdownOpen && (
        <ul className='absolute top-full left-0 w-full flex flex-col space-y-2 p-2 text-center items-center bg-light-primary dark:bg-dark-primary text-light-secondary dark:text-dark-secondary'>
          <li className='border-b-2 border-b-light-primary dark:border-b-dark-secondary w-full'>
            <a href='/'>{translations.home}</a>
          </li>
          <li className='border-b-2 border-b-light-primary dark:border-b-dark-secondary w-full'>
            <a href='/about'>{translations.about}</a>
          </li>
          <li className='w-full'>
            <a href='/experience'>{translations.experience}</a>
          </li>
        </ul>
      )}
    </div>
  );
};

export default BurgerBtn;
