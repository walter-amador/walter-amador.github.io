import React from 'react';
import LogoIcon from './Icons/LogoIcon';
import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@root/i18n.config';
import LocaleBtn from './Buttons/LocaleBtn';
import BurgerBtn from './Buttons/BurgerBtn';

type NavbarProps = {
  lang: Locale;
};

const Navbar: React.FC<NavbarProps> = async ({ lang }) => {
  const { navigation } = await getDictionary(lang);
  return (
    <header className='absolute left-0 right-0'>
      <nav className='relative z-10 flex items-center justify-between p-4 bg-transparent text-light-secondary dark:text-dark-secondary'>
        <div className='flex items-center'>
          <span className='text-xl mr-4'>
            <LogoIcon width='32px' height='32px' />
          </span>

          <ul className='hidden md:flex ml-4 space-x-8 items-center '>
            <li className='hover:border-b-2 hover:border-b-light-primary hover:dark:border-b-dark-secondary'>
              <a href='/'>{navigation.home}</a>
            </li>
            <li className='hover:border-b-2 hover:border-b-light-primary hover:dark:border-b-dark-secondary'>
              <a href='/experience'>{navigation.experience}</a>
            </li>
            <li className='hover:border-b-2 hover:border-b-light-primary hover:dark:border-b-dark-secondary'>
              <a href='/about'>{navigation.about}</a>
            </li>
            <li className='hover:border-b-2 hover:border-b-light-primary hover:dark:border-b-dark-secondary'>
              <a href='/testimonials'>{navigation.testimonials}</a>
            </li>
          </ul>
        </div>

        {/* Language Button */}

        <div className='flex items-center'>
          <LocaleBtn lang={lang} />
          <BurgerBtn translations={navigation} />
        </div>
        {/* <div className='flex md:hidden'>

        </div> */}
      </nav>
    </header>
  );
};

export default Navbar;
