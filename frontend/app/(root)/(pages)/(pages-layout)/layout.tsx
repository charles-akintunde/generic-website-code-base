import React from 'react';
import Footer from '../../../../components/hoc/layout/footer/footer';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
