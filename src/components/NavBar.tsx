"use client";

import NavLink from "./NavLink";
import Image from "next/image";
import Link from "next/link";
import MenuMobile from "./MenuMobile";
import { libre } from "@/fonts/fonts";

const NavBar = () => {
  return (
    <header>
      <div className="flex w-full md:w-full lg:w-full justify-end h-full align-bottom py-4 z-40 bg-[#E3D2A8]  items-center">
        <Link href="/">
          <h1 className={`${libre.className}  text-xl font-light my-2 uppercase text-center w-fit`}>
            Catalina Barrionuevo
          </h1>
        </Link>
        <nav className="w-full flex justify-center lg:justify-end items-end list-none gap-3 uppercase">
          <div>
            <NavLink
              className="w-25 hidden hover:scale-105 transition-all xl:flex "
              route="/"
              description="Home"
            />
          </div>
          <div>
            <NavLink
              className="w-25 hover:scale-105 transition-all hidden xl:flex"
              route="/#contact"
              description="Contact"
            />
          </div>
        </nav>
        <nav className="md:hidden absolute right-0">
          <MenuMobile />
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
