import { Link } from 'react-scroll';
import { Icon } from '@iconify/react';
import htmlIcon from '@iconify/icons-whh/html';
import menuAlt2 from '@iconify/icons-heroicons-solid/menu-alt-2';
import closeFill from '@iconify/icons-eva/close-fill';

//Components
import LinkItem from './LinkItem';
import { useState } from 'react';

const Header = () => {
    const [toggle, setToggle] = useState(false);

    const handleToggle = () =>{
        setToggle(!toggle);
    }

    return (
        <header className="flex flex-row-reverse md:flex-row md:bg-gray-50 md:shadow-md fixed top-0 inset-x-0  h-16 items-center justify-between px-4 md:px-8 z-50">
            <div>
                <Icon icon={htmlIcon} className="text-3xl"/>
            </div>
            <div 
                className={`${toggle ? 'translate-x-0' : '-translate-x-44'} 
                    transform duration-500 ease-in-out absolute top-16 left-4 bg-white rounded-2xl px-6 py-4 shadow-lg w-40
                    md:w-auto md:shadow-none md:translate-x-0 md:bg-transparent md:p-0 md:static`}>
                <nav className='w-full flex-col space-y-4 md:space-y-0 md:flex-row flex justify-evenly items-center md:space-x-8'>
                    <LinkItem content='Home' link="HomeSection"/>
                    <LinkItem content='About Me' link="AboutSection"/>
                    <LinkItem content='Skills' link="SkillsSection"/>
                    <LinkItem content='Projects' link="ProjectsSection"/>
                    <LinkItem content='Contact' link="ContactSection"/>
                </nav>
            </div>
            <div className="bg-white rounded-full p-2 shadow-lg md:hidden">
                <Icon onClick={handleToggle} icon={ !toggle ? menuAlt2 : closeFill} className='text-3xl text-blue-400 cursor-pointer active:scale-100'/>
            </div>
        </header>
    );
}

export default Header;
