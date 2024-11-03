import React from 'react';
import { appConfig } from '../../../utils/appConfig';

const HomeWithoutFooter = () => {
  return (
    <div className="relative w-full text-black h-screen overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
      >
        <source src={appConfig.pathToHomeVideo} />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 flex items-center justify-center h-full bg-black bg-opacity-30">
        <h1 className="text-white text-4xl font-bold">
          Welcome to Generic Website
        </h1>
      </div>
    </div>
  );
};

export default HomeWithoutFooter;
