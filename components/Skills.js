import { Icon } from "@iconify/react";

import ProgressBar from "./ProgressBar";

const Skills = () => {
    return (
        <section id="SkillsSection" name="SkillsSection" className="min-h-screen flex flex-col justify-center">
            <h2 className="text-blue-400 text-3xl font-extrabold mx-auto my-16 text-center">Skills</h2>

            <div className="flex flex-col w-11/12 mx-auto space-y-8 md:justify-center md:flex-row md:space-y-0 md:space-x-8">
                <div className="flex-1 max-w-xl">
                    <div className="space-y-2">
                        <ProgressBar icon="vscode-icons:file-type-html" progress="11" color="bg-green-400" />
                        <ProgressBar icon="vscode-icons:file-type-css" progress="11" color="bg-green-400" />
                        <ProgressBar icon="vscode-icons:file-type-reactjs" progress="11" color="bg-green-400" />
                        <ProgressBar icon="logos:nodejs-icon" progress="6" color="bg-yellow-400" />
                        <ProgressBar icon="logos:git-icon" progress="11" color="bg-green-400" />
                        <div className="mt-4 space-y-2">
                            <p className="text-gray-600 font-bold text-sm">Other technologies that I've used before:</p>
                            <div className="flex items-center space-x-4 md:space-x-8">
                                <Icon icon="logos:c-sharp" className="text-4xl" />
                                <Icon icon="simple-icons:microsoftsqlserver" className="text-4xl text-red-500" />
                                <Icon icon="simple-icons:mysql" className="text-4xl text-blue-600" />
                                <Icon icon="logos:java" className="text-4xl" />
                                <Icon icon="logos:tailwindcss-icon" className="text-3xl" />
                                <Icon icon="logos:laravel" className="text-4xl" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 max-w-xl">
                    <p className="text-gray-600 font-bold">Along my journey as a <span className='text-blue-400'> computer science </span>  
                    student, I've been learning many technologies to develop <span className="text-blue-400"> frontend </span>
                    and <span className="text-blue-400">backend software</span>. I havent't limited
                    myself to the knowledge provided by the university, I love web development
                    so much that I started <span className="text-blue-400"> teching myself other technologies
                    such as Reactjs </span> with which I fell in love.
                    <br /><br />
                    Working with other programmers is not a problem for me, I really prefer getting
                    feedback from my coworkers to know what to <span className="text-blue-400"> improve as a professional </span>
                    and becoming a better person and web developer each day.
                    </p>
                </div>
            </div>

        </section>
    );
}

export default Skills;
