'use client';

// Libraries
import React, { FC, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// Components
import GlobeIcon from '../Icons/GlobeIcon';

// Config
import { Locale, i18n } from '@root/i18n.config';

type LocaleBtnProps = {
  lang: Locale;
};

const LocaleBtn: FC<LocaleBtnProps> = ({ lang }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const pathName = usePathname();

  const redirectedPathName = (locale: string) => {
    if (!pathName) return '/';

    const pathnameIsMissingLocale = i18n.locales.every(
      (locale) =>
        !pathName.startsWith(`/${locale}/`) && pathName !== `/${locale}`
    );

    if (pathnameIsMissingLocale) {
      if (locale === i18n.defaultLocale) return pathName;
      return `/${locale}${pathName}`;
    } else {
      if (locale === i18n.defaultLocale) {
        const segments = pathName.split('/');
        const isHome = segments.length === 2;
        if (isHome) return '/';

        segments.splice(1, 1);
        return segments.join('/');
      }

      const segments = pathName.split('/');
      segments[1] = locale;
      return segments.join('/');
    }
  };

  return (
    <div className='relative right-0 bg-dark-primary dark:bg-light-primary text-light-primary dark:text-dark-primary border border-gray-300 rounded-md'>
      <button
        onClick={handleToggleDropdown}
        className='flex items-center justify-center w-full px-2 py-1 text-sm font-medium rounded-lg bg-dark-primary dark:bg-light-primary border-b focus:outline-none'
      >
        <GlobeIcon className='w-5 h-5 mr-2' />
        {lang}
        <svg
          className={`w-5 h-5 ml-2 -mr-1 ${
            isDropdownOpen ? 'transform rotate-180' : ''
          }`}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill='currentColor'
          aria-hidden='true'
        >
          <path fillRule='evenodd' d='M10 12l-6-6h12l-6 6z' />
        </svg>
      </button>
      {isDropdownOpen && (
        <ul className='absolute top-full w-full bg-dark-primary dark:bg-light-primary py-1 flex flex-col text-center p-2 rounded-lg shadow-lg'>
          {i18n.locales.map((locale) => {
            return (
              <li
                key={locale}
                className='w-full border-b-2 p-2 border-b-light-primary dark:border-b-dark-primary'
              >
                <Link href={redirectedPathName(locale)}>{locale}</Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default LocaleBtn;
