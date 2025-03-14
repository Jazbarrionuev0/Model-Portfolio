import Image from "next/image";
import React from "react";

function ServicesCards({ image, title, description }: { image: string; title: string; description: string }) {
  return (
    <div className="w-[340px] h-[250px] bg-white hover:border-b-8 hover:border-[#FF00CC] transition-all flex flex-col justify-center items-start p-10">
      <Image src={image} alt="background image" width={79} height={69} className="" />
      <h1 className={` text-xl font-bold`}>{title}</h1>
      <p className="text-gray-400 text-start">{description}</p>
    </div>
  );
}

export default ServicesCards;
