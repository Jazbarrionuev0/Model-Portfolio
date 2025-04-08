import React from "react";
import Header from "./header";
import { Toaster } from "@/components/ui/toaster";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      {children}
      <Toaster />
    </div>
  );
};

export default Layout;
