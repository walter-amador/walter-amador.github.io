import React from 'react';

type ButtonProps = {
    text: string;
    icon?: string;
    filled?: boolean;
    outline?: boolean;
    href?: string;
    onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
    text,
    icon,
    filled,
    outline,
    href,
    onClick,
}) => {
    const buttonClass = `button ${filled ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} ${outline ? 'border border-blue-500' : ''}`;

    if (href) {
        return (
            <a href={href} className={buttonClass}>
                {icon && <span className="icon">{icon}</span>}
                {text}
            </a>
        );
    }

    return (
        <button className={buttonClass} onClick={onClick}>
            {icon && <span className="icon">{icon}</span>}
            {text}
        </button>
    );
};

export default Button;
