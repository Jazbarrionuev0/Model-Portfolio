import React from "react";
import { lato, libre } from "@/fonts/fonts";
import { CarouselImg } from "../CarouselImg";
import { MoveLeft, MoveRight } from "lucide-react";

function Photos() {
  return (
    <main className="flex flex-col min-h-screen bg-black text-white overflow-x-hidden">
      <div className="flex flex-col justify-center items-center w-full py-20 md:py-32 px-4">
        <div className="flex items-center justify-center gap-4 md:gap-8 max-w-4xl w-full mb-8 md:mb-12">
          <MoveLeft className="text-white w-8 h-8 md:w-12 md:h-12" />
          <h1 className={`${libre.className} text-3xl md:text-5xl font-light uppercase text-center`}>Hola, soy Catalina!</h1>
          <MoveRight className="text-white w-8 h-8 md:w-12 md:h-12" />
        </div>
        <h2 className={`${lato.className} text-xl md:text-2xl text-white/80`}>FASHION MODEL | MODEL</h2>
      </div>
      <div className="flex-1 w-full pb-20 md:pb-32">
        <CarouselImg />
      </div>
    </main>
  );
}

export default Photos;
