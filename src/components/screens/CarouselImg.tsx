"use client";

import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import { Image as ImageType } from "@/types/image";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

export function CarouselImg({
  images,
  onSlideChange,
  currentIndex,
}: {
  images: ImageType[];
  onSlideChange?: (index: number) => void;
  currentIndex?: number;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      containScroll: "trimSnaps",
    },
    [
      Autoplay({
        delay: 3000,
        stopOnInteraction: true,
      }),
    ]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    if (onSlideChange) onSlideChange(index);
  }, [emblaApi, onSlideChange]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (emblaApi && currentIndex !== undefined && currentIndex !== selectedIndex) {
      emblaApi.scrollTo(currentIndex);
    }
  }, [currentIndex, emblaApi, selectedIndex]);

  return (
    <div className="w-full max-w-[100vw] overflow-hidden px-4 md:px-8">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4 md:-ml-8">
          {images.map((image) => (
            <div key={image.id} className="pl-4 md:pl-8 min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333333%] xl:flex-[0_0_25%]">
              <div className="h-full py-4 md:py-8">
                <Card className="rounded-lg border-none bg-transparent">
                  <CardContent className="flex aspect-[2/3] items-center justify-center p-0">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      width={800}
                      height={1200}
                      className="h-full w-full object-cover transition-all duration-300 hover:scale-105 rounded-md"
                      priority
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden sm:block">
        <button
          className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-2"
          onClick={() => emblaApi?.scrollPrev()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-2"
          onClick={() => emblaApi?.scrollNext()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Navigation dots */}
      <div className="flex md:hidden justify-center mt-4 mb-6 pb-4 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`transition-all rounded-full ${selectedIndex === index ? "w-6 h-1 bg-white" : "w-2 h-1 bg-gray-500"}`}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
