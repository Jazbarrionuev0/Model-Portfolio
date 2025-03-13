'use client'
import * as React from "react"
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image";

export function CarouselImg() {
    return (
        <Carousel

            opts={{
                loop: true,
                align: "start",
            }}
            className="p-5"
            plugins={[
                Autoplay({
                    delay: 2000,
                    stopOnInteraction: false
                }),
            ]}
        >
            <CarouselContent>
                {Array.from({ length: 6 }).map((_, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/5 ">
                        <div className="p-1">
                            <Card className="rounded-none border-none ">
                                <CardContent className="flex items-center justify-center  p-0">
                                    <Image
                                        src="/cativertical.jpg"
                                        alt="Portfolio image 2"
                                        width={1143}
                                        height={1714}
                                        className="h-full w-full object-cover"
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>


        </Carousel>
    )
}
