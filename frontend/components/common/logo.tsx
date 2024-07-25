import React from 'react';
import Image from 'next/image';
import appLogo from '@/assets/icons/gw-logo.png';
import Link from 'next/link';
const Logo = () => {
  return (
    <div className="flex cursor-pointer items-center">
      <Link href="/">
        <Image
          src={appLogo}
          alt="App logo"
          style={{
            height: 'auto',
            width: 'auto',
            maxHeight: '80px',
            maxWidth: '500px',
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
