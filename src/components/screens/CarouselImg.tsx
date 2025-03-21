"use client";

import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Image as ImageType } from "@/types/image";
import Image from "next/image";

export function CarouselImg({ images }: { images: ImageType[] }) {
  return (
    <Carousel
      opts={{
        loop: true,
        align: "center",
        containScroll: "trimSnaps",
      }}
      className="w-full max-w-[100vw] overflow-hidden px-4 md:px-8"
      plugins={[
        Autoplay({
          delay: 3000,
          stopOnInteraction: true,
        }),
      ]}
    >
      <CarouselContent className="-ml-4 md:-ml-8">
        {images.map((image) => (
          <CarouselItem key={image.id} className="pl-4 md:pl-8 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            <div className="h-full py-4 md:py-8">
              <Card className="rounded-lg border-none bg-transparent">
                <CardContent className="flex aspect-[2/3] items-center justify-center p-0">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={800}
                    height={1200}
                    className="h-full w-full object-cover transition-all duration-300 hover:scale-105"
                    priority
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden sm:block">
        <CarouselPrevious className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80" />
        <CarouselNext className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80" />
      </div>
    </Carousel>
  );
}
