import { Icon } from '@iconify/react';

const Main = () => {
    return (
        <section id='HomeSection' name='HomeSection' className="relative w-full h-screen flex flex-col items-center md:flex-row overflow-hidden">
            <div className="flex-1 flex justify-center items-center flex-col space-y-2">
                <div className="w-full md:w-2/3 lg:w-4/5 space-y-2">
                    <p className="text-lg lg:text-2xl text-gray-700 text-center md:text-left xl:text-2xl">Hello, I'm</p>
                    <p className="text-3xl lg:text-5xl text-blue-400 font-black text-center md:text-left xl:text-5xl">Walter Amador</p>
                    <p className="text-lg lg:text-2xl text-gray-700 font-bold text-center md:text-left xl:text-2xl">Fullstack Web Developer</p>
                </div>
                <div className="py-4 w-full flex items-center justify-center md:w-2/3 lg:w-4/5 md:justify-start">
                    <a href="" className="btn text-xs">Access my resumé</a>
                </div>
                <div className="flex justify-center space-x-8 w-full md:w-2/3 lg:w-4/5 md:justify-start">
                    <a href="">
                        <Icon icon="akar-icons:github-fill" className="text-3xl text-blue-400 cursor-pointer" />
                    </a>
                    <a href="">
                        <Icon icon="akar-icons:linkedin-fill" className="text-3xl text-blue-400 cursor-pointer" />
                    </a>
                    <a href="">
                        <Icon icon="cib:leetcode" className="text-3xl text-blue-400 cursor-pointer" />
                    </a>
                </div>
            </div>
            <div className="flex-1 flex justify-center items-center">
                <div className="z-10 bg-white rounded-xl shadow-lg text-blue-400 p-1 text-xs md:p-2 md:text-sm lg:p4 lg:text-base space-y-1  md:w-auto">
                    <pre>1   class <b>Developer</b> {'\u007B'} </pre>
                    <pre>2     constructor() {'\u007B'}</pre>
                    <pre>3         this.name = "<b>Walter Amador</b>";</pre>
                    <pre>4         this.skills = ["<b>FRONTEND</b>","<b>BACKEND</b>"];</pre>
                    <pre>5         this.experience = 3;</pre>
                    <pre>6     {'\u007D'}</pre>
                    <pre>7   {'\u007D'}</pre>
                </div>
            </div>
            <div className="h-96 w-96 -right-1/2 top-1/2 absolute md:h-[850px] md:w-[850px] rounded-3xl rotate-45 md:top-10 md:-right-3/4 lg:-right-96 bg-blue-400"></div>
        </section>
    );
}

export default Main;
