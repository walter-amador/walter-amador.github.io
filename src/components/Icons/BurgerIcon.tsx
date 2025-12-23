import React from 'react';

type BurgerIconProps = {
  width?: string;
  height?: string;
  className?: string;
};

const BurgerIcon: React.FC<BurgerIconProps> = ({
  width,
  height,
  className,
}) => {
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
        d='M5 12H20'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
      />
      <path
        d='M5 17H20'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
      />
      <path
        d='M5 7H20'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
      />
    </svg>
  );
};

export default BurgerIcon;
