import React from 'react';
import Cards from '../components/Cards';
import experiences from '../data/experience.json';

const Experience = () => {
    return (
        <section id='ExperienceSection' name='ExperienceSection' className="pt-32 bg-gray-50 w-full overflow-hidden min-h-screen flex flex-col justify-center">
            <h2 className="text-blue-500 text-3xl font-extrabold mx-auto my-8 text-center">Experience</h2>
            <div className="">
                {experiences.map(({title, date, desc, refs, imgs}, key) => (
                    <Cards key={key} title={title} date={date} desc={desc} refs={refs} imgs={imgs} />
                ))}
                {/* <Cards /> */}
            </div>
        </section>
    );
}

export default Experience;
