import React from 'react';
import Header from './header/header';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="">{children}</main>
    </div>
  );
};

export default Layout;
