import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css"

// import Swiper core and required modules
import SwiperCore, {
    Navigation,Pagination,Mousewheel,Keyboard
  } from 'swiper/core';
  
// install Swiper modules
SwiperCore.use([Navigation,Pagination,Mousewheel,Keyboard]);

const Cards = ({title, date, desc, refs, imgs}) => {
    const imgstest = [1,2,3,4,5];
    return (
        <div className="flex flex-col lg:flex-row mx-4 my-2 lg:mx-16 lg:my-8">
            <div className="flex-1 p-4">
                <Swiper cssMode={true} navigation={true} slidesPerView={'auto'} centeredSlides={true} spaceBetween={30} pagination={{"clickable": true}} className="mySwiper">
                    
                    {imgs.map((link, key) => (
                        <SwiperSlide key={key}>
                            <img src={link} alt="experience" loading='lazy' width={695} height={405} />
                        </SwiperSlide>
                    ))}

                </Swiper>
            </div>
            <div className="flex-1 p-4 space-y-2">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold">{title}</h3>
                    <time className="text-gray-500 text-sm">{date}</time>
                </div>
                <div className="space-y-2">
                    <div className="">
                        <ul className="list-disc pl-4">
                            {desc.map((item, key) => (
                                <li key={key}>
                                    <p>{item}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="">
                        <h4 className="text-gray-600">References:</h4>
                        <ul className="list-disc pl-4">
                            {refs.map((item, key) => (
                                <li key={key}>
                                    <a className="underline text-blue-600" href={item.link}>{item.desc}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cards;
