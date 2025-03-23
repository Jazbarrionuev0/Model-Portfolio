import { Brand } from "@/types/campaign";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const Brands = ({ brands }: { brands: Brand[] }) => {
  if (!brands || brands.length === 0) {
    return <div className="text-center text-muted-foreground py-4">No hay colaboraciones disponibles</div>;
  }

  return (
    <div className="py-16 md:py-24 px-4 space-y-10 w-full max-w-7xl mx-auto">
      <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 relative">
        <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Colaboraciones
        </span>
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
      </h3>
      
      <div className="flex flex-wrap justify-center gap-8 md:gap-12">
        {brands.map((brand, index) => (
          <div 
            key={index} 
            className="group relative w-32 h-32 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
            <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-xl shadow-sm z-10 flex flex-col items-center justify-center p-4">
              {brand.logo && (
                <div className="w-16 h-16 relative mb-2">
                  <Image 
                    src={brand.logo.url} 
                    alt={`${brand.name} logo`}
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </div>
              )}
              
              <h4 className="text-sm font-medium text-center mt-2 line-clamp-2">
                {brand.link ? (
                  <Link href={brand.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                    {brand.name}
                  </Link>
                ) : (
                  brand.name
                )}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brands;
