import React from 'react';
import Header from './header/header';
import Footer from './footer/footer';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
