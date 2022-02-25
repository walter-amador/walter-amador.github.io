
const About = () => {
    return (
        <section id='AboutSection' name='AboutSection' className="bg-gray-50 w-full overflow-hidden min-h-screen flex flex-col justify-center">
            <h2 className="text-blue-500 text-3xl font-extrabold mx-auto my-8 text-center">About Me</h2>
            <div className="bg-blue-500 -skew-y-2 w-full py-8 md:py-14">
                <div className="skew-y-2 w-11/12 mx-auto">
                    <div className="flex flex-col items-center space-y-8 md:flex-row md:space-x-8">
                        <div className="flex justify-center items-center md:flex-1">
                            <div className="h-60 w-60 rounded-full overflow-hidden bg-gradient-to-r from-white via-blue-50 to-blue-100">
                                <img
                                    src="/me-original-min.jpg"
                                    alt="Picture of the author"
                                    className="object-cover w-full h-full"
                                    loading='lazy'
                                />
                            </div>
                        </div>
                        <div className="flex justify-center items-center md:flex-1">
                            <p className="text-white">
                                Hi, my name is <b>Walter Amador</b>, I am currently a senior student majoring Computer Science at the “Universidad Católica de Honduras”. I really like teaching myself how things work, specially how web applications are made, that’s why I am a Reactjs developer.
                                <br />
                                <br />
                                I am eager of working on a real world job, willing to give me the opportunity of being part of the new technological world by letting me build and improve software development projects together with a proficient work team.
                            </p>
                        </div>
                    </div>
                    <div className="md:mt-16">
                        <h3 className="text-2xl text-white font-bold text-center my-8">My three favorite sayings</h3>
                        <div className="text-gray-700 font-semibold flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-8">
                            <div className="h-20 bg-white shadow-lg rounded-xl py-4 px-2 flex justify-center items-center lg:w-4/12">
                                <p className="text-center">Never stop learing</p>
                            </div>
                            <div className="h-20 bg-white shadow-lg rounded-xl py-4 px-2 flex justify-center items-center lg:w-4/12">
                                <p className="text-center">Your future is created by what you do today, not tomorrow</p>
                            </div>
                            <div className="h-20 bg-white shadow-lg rounded-xl py-4 px-2 flex justify-center items-center lg:w-4/12">
                                <p className="text-center">Always dream big, work hard and smart to achieve your goals</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;
