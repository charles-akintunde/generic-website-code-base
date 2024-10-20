import React from 'react';
import Image from 'next/image';
import appLogo from '@/assets/icons/gw-logo.png';
import Link from 'next/link';
import { appConfig } from '../../utils/appConfig';

interface ILogoProps {
  width?: number;
  height?: number;
}

const Logo: React.FC<ILogoProps> = ({ width = 500, height = 80 }) => {
  return (
    <div className="flex cursor-pointer justify-center  items-center">
      <Link href="/">
        <Image
          src={appConfig.appLogo}
          alt="App logo"
          style={{
            height: 'auto',
            width: 'auto',
            maxHeight: `${height}px`,
            maxWidth: `${width}px`,
          }} // Ensures responsive scaling
        />
      </Link>

      {/* <p className="text-base pl-1 font-bold whitespace-nowrap">
        Generic Website
      </p> */}
    </div>
  );
};

export default Logo;
