import React from "react";
import Header from "./header";
import { Analytics } from "@vercel/analytics/next";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      {children}
      <Analytics />
    </div>
  );
};

export default Layout;
