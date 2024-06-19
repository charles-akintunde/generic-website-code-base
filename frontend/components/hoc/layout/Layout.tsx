import React from 'react';
import Header from './header/Header';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
    </div>
  );
};

export default Layout;
