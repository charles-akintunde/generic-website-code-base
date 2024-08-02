import React, { ReactNode } from 'react';

interface HoverableCardProps {
  children: ReactNode;
  classNames?: string;
}

const HoverableCard: React.FC<HoverableCardProps> = ({
  children,
  classNames,
}) => {
  return (
    <div
      className={`${classNames} transition cursor-pointer  duration-300 ease-in-out hover:text-primary transform hover:bg-opacity-50 hover:bg-gray-100 rounded-md  p-4`}
    >
      {children}
    </div>
  );
};

export default HoverableCard;
