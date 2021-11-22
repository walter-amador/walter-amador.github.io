import ProjectCard from "../components/ProjectCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import projects from '../data/projects.json';

// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css"

// import Swiper core and required modules
import SwiperCore, {
    Navigation,Pagination,Mousewheel,Keyboard
  } from 'swiper/core';
  
// install Swiper modules
SwiperCore.use([Navigation,Pagination,Mousewheel,Keyboard]);


const Projects = () => {
    return (
        <section id="ProjectsSection" name="ProjectsSection" className="min-h-screen flex flex-col justify-center">
            <h2 className="text-blue-400 text-3xl font-extrabold mx-auto my-8 text-center">Side Projects</h2>

            <div className="w-full min-h-96 bg-blue-400 flex">
                <div className="relative w-full">
                <Swiper cssMode={true} navigation={true} slidesPerView={'auto'} centeredSlides={true} spaceBetween={30} pagination={{"clickable": true}} className="mySwiper">
                    
                    {projects.map(({id, title, content, img, techs, repo, demo}) => (
                        <SwiperSlide key={id}>
                            <ProjectCard
                                key={id}
                                title={title}
                                content={content}
                                img={img}
                                techs={techs}
                                repo={repo}
                                demo={demo}
                            />
                        </SwiperSlide>
                    ))}

                </Swiper>
                    
                </div>
            </div>
        </section>
    );
}

export default Projects;
