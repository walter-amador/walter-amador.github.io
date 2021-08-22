import { Icon } from "@iconify/react";


const ProgressBar = ({icon, progress, color}) => {
    return (
        <div className="flex items-center md:space-x-4">
            <div className="w-12 flex justify-center items-center">
                <Icon icon={icon} className="text-5xl" />
            </div>
            <div className="flex-1 px-2">
                <div className="h-6 w-full bg-gray-300 rounded-full">
                    <div className={`h-full w-${progress}/12 rounded-full ${color}`}></div>
                </div>
            </div>
        </div>
    );
}

export default ProgressBar;
