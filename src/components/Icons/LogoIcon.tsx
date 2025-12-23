import React from 'react';

type LogoIconProps = {
  width?: string;
  height?: string;
  className?: string;
};

const LogoIcon: React.FC<LogoIconProps> = ({ width, height, className }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        stroke='currentColor'
        d='M7 8L3 12L7 16'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        stroke='currentColor'
        d='M17 8L21 12L17 16'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        stroke='currentColor'
        d='M14 4L9.8589 19.4548'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default LogoIcon;
