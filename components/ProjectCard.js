import { Icon } from "@iconify/react";

const ProjectCard = ({title, content, img, techs, repo, demo}) => {
    return (
        <div className="flex items-center justify-center py-8">
            <div className="flex flex-col bg-gray-50 rounded-lg w-11/12 md:w-8/12 lg:w-7/12 px-6 py-8 space-y-4 shadow-lg">
                <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
                    <div className="lg:flex-1">
                        <h3 className="text-gray-800 font-bold text-2xl">{title}</h3>
                        <p className="text-gray-600 text-base">
                            {content}
                        </p>
                    </div>
                    <div className="flex items-center flex-col space-y-4 lg:flex-1">
                        <img
                            src={img}
                            alt="Picture of the author"
                            width={500}
                            height={300}
                            className="object-cover rounded-lg shadow-lg"
                        />
                        <div className="flex w-full items-center space-x-4">
                            <p className="text-gray-400 text-sm font-bold">Tech used: </p>

                            {techs.map((tech,index) => (
                                <Icon key={index} icon={tech} className="text-3xl" />
                                ))}
                        </div>
                    </div>
                </div>
                <div className="flex w-full max-w-md items-center space-x-8">
                    {repo && <a href={repo} className="btn flex-grow flex items-center justify-center text-xs">Github Repo <Icon icon="akar-icons:github-fill" className="text-2xl ml-2" /></a>}
                    {demo && <a href={demo} className="btn flex-grow h-12 flex items-center justify-center text-xs">Live Demo</a>}
                </div>
            </div>
        </div>
    );
}

export default ProjectCard;
