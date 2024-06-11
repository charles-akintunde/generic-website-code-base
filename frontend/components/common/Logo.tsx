import React from 'react';
import Image from 'next/image';
import appLogo from '@/assets/icons/gw-logo.png';
const Logo = () => {
  return (
    <>
      <Image
        src={appLogo}
        alt="App logo"
        width={40}
        height={40}
        className="h-10 w-auto"
      />
      <p className="text-base pl-1 font-bold">Generic Website</p>
    </>
  );
};

export default Logo;
