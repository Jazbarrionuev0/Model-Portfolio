"use client";

import { Button } from "./ui/button";
import NavLink from "./NavLink";
import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
const MenuMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(!isOpen)} className="select-none bg-transparent text-white font-bold text-4xl">
        ☰
      </Button>
      {isOpen && (
        <div className="z-30 fixed left-0 right-0 top-0 bottom-0 bg-black border-none">
          <header className="w-full flex justify-center pt-6">
            <Image
              src={"/rooflogodef.png"}
              alt="background image"
              width={954}
              height={577}
              quality={25}
              priority={true}
              className="md:w-32 md:h-20 w-20 h-10"
            />
            <X className="bg-transparent text-white  rounded-md fixed right-6" onClick={closeMenu} />
          </header>
          <section className="flex justify-center">
            <nav className="mt-8 flex flex-col justify-center items-center list-none gap-10 uppercase  w-full h-[70vh] text-3xl">
              <NavLink description="Nosotros" route="#nosotros" onClick={closeMenu} />
              <NavLink description="Carta" route="#carta" onClick={closeMenu} />
              <NavLink description="Horarios" route="#horarios" onClick={closeMenu} />
              <NavLink description="Contacto" route="#contact" onClick={closeMenu} />
            </nav>
          </section>
        </div>
      )}
    </div>
  );
};

export default MenuMobile;
