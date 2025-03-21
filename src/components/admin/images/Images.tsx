"use client";
import { Image as ImageType } from "@/types/image";
import ImageManager from "./image-manager";

const Images = ({ carouselImages, heroImages }: { heroImages: ImageType[]; carouselImages: ImageType[] }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <ImageManager 
        images={heroImages} 
        type="hero" 
        title="Hero" 
        emptyMessage="No hay imágenes hero" 
        minImages={2} 
      />
      <ImageManager 
        images={carouselImages} 
        type="carousel" 
        title="Carousel" 
        emptyMessage="No hay imágenes de carousel" 
      />
    </div>
  );
};

export default Images;
