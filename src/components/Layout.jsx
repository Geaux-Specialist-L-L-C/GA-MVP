import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './layout/Header';

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default Layout;
