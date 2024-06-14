import React from 'react';
import Header from './header/Header';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};

export default Layout;
