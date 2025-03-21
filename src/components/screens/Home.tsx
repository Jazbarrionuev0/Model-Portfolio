import React from "react";
import { PortfolioButton } from "../hero/PortfolioButton";
import HomeImg from "../hero/HomeImg";
import { lato, libre } from "@/fonts/fonts";
import { AdminButton } from "../hero/AdminButton";
import { Image } from "@/types/image";

function HomePage({ images }: { images: Image[] }) {
  return (
    <main className="flex min-h-screen bg-black text-white">
      <div className="flex-1 ml-4 md:ml-24">
        <div className="flex flex-col md:grid md:grid-cols-[1fr,auto] gap-4 md:gap-8 min-h-screen">
          {/* Left Content */}
          <div className="flex flex-col justify-center px-6 md:px-16 max-w-2xl pt-12 md:pt-0">
            <h2 className={`${lato.className} text-xl md:text-2xl text-white/70 mb-2 md:mb-4`}>FASHION MODEL</h2>
            <h1 className={`${libre.className} font-playfair text-4xl md:text-7xl font-light tracking-wide mb-8 md:mb-12 leading-tight`}>
              CATALINA
              <br />
              BARRIONUEVO
            </h1>
            <PortfolioButton />
            <AdminButton />
          </div>

          {/* Right Content */}
          <div className="grid grid-cols-1 gap-4 h-[60vh] md:h-screen overflow-hidden">
            <HomeImg heroImages={images} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default HomePage;
