import React from 'react';
import {Link} from 'react-scroll';

const LinkItem = ({content, link}) => {
    
    return(
        <Link
            activeClass='bg-blue-400 text-white rounded-full px-4 py-2'
            className='cursor-pointer font-extrabold transition duration-100 ease-out'
            to={link}
            spy={true}
            smooth={true}
            duration={500}
        >
            {content}
        </Link>
    );
}

export default LinkItem;