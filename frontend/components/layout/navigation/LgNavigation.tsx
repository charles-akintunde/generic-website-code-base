import React from 'react';
import MenuItems from '../menu-items/MenuItems';

const LgNavigation = () => {
  return (
    <div className="flex-row space-y-6 lg:space-y-0 lg:space-x-6">
      <MenuItems />
    </div>
  );
};

export default LgNavigation;
