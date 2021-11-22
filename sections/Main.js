import { Icon } from '@iconify/react';
import svg from '../public/svg/programmer.svg';

const Main = () => {
    return (
        <section 
            id='HomeSection' name='HomeSection'
            style={{backgroundImage: "url(/main-texture.webp)", backgroundPosition: "50% 90%"}} 
            className="relative w-full h-screen bg-top bg-no-repeat bg-cover grid grid-cols-1 md:grid-cols-2 items-center md:flex-row overflow-hidden">
            <div data-aos="fade-right" data-aos-duration="1000" className="flex-1 flex justify-center items-center flex-col space-y-2 lg:mb-8">
                <div className="w-full md:w-2/3 lg:w-4/5 space-y-2">
                    <p className="text-lg lg:text-2xl text-gray-50 text-center md:text-left xl:text-2xl">Hello, I'm</p>
                    <p style={{color: "rgb(255, 219, 102)"}} className="text-3xl lg:text-5xl drop-shadow-lg font-black text-center md:text-left xl:text-5xl">
                        Walter Amador
                    </p>
                    <h1 className="text-lg lg:text-2xl text-gray-50 font-bold text-center md:text-left xl:text-2xl">Fullstack Web Developer</h1>
                </div>
                <div className="py-4 w-full flex items-center justify-center md:w-2/3 lg:w-4/5 md:justify-start">
                    <a href="" className="transition-all duration-100 rounded-md px-4 py-3 bg-gradient-to-r from-blue-800 via-blue-600 to-blue-500 border-[3px] border-gray-300 text-white hover:shadow-lg text-xs">Access my resumé</a>
                </div>
                <div className="flex justify-center space-x-8 w-full md:w-2/3 lg:w-4/5 md:justify-start">
                    <a href="https://github.com/WalterIran" target="_blank">
                        <Icon icon="akar-icons:github-fill" className="text-3xl text-gray-50 cursor-pointer" />
                    </a>
                    <a href="https://www.linkedin.com/in/walter-amador-2149b61b4/" target="_blank">
                        <Icon icon="akar-icons:linkedin-fill" className="text-3xl text-gray-50 cursor-pointer" />
                    </a>
                    <a href="https://leetcode.com/WalterIran/" target="_blank">
                        <Icon icon="cib:leetcode" className="text-3xl text-gray-50 cursor-pointer" />
                    </a>
                </div>
            </div>
            <div data-aos="fade-left" data-aos-delay="500" data-aos-duration="1000" className="flex-1 flex justify-center items-center">
                <img className="z-10" src="/svg/programmer.svg" alt="programmer" />
            </div>
        </section>
    );
}

export default Main;
