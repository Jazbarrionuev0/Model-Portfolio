import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Link from "next/link"
import { zen } from "@/fonts/fonts";

export function ProductsCarousel({ num }: { num: number }) {
    const plugin = React.useRef(
        Autoplay({ delay: num, stopOnInteraction: false })
    )

    return (
        <Carousel
            opts={{
                loop: true,
                watchDrag: true,
            }}
            plugins={[plugin.current]}
            className="w-[450px]  cursor-pointer rounded-md"

        >
            <CarouselContent className="rounded-md">
                {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index} className="rounded-md">
                        <div className="p-1 rounded-md">
                            <Link href="/" className="rounded-md">

                                <Card className="border-none rounded-md  p-0 bg-transparent shadow-none">
                                    <CardContent className="flex rounded-md  p-0 items-center justify-center border-none">

                                        <Image
                                            src="/website.jpeg"
                                            alt="foto"
                                            className="w-full h-full lg: object-cover rounded-md"
                                            width={550}
                                            height={350}
                                        />
                                    </CardContent>

                                    <h1 className={`${zen.className} text-xl text-center my-5 capitalize`}> How to Stretch Your budget When Money Is Tight.  </h1>
                                </Card>
                            </Link>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>

        </Carousel>
    )
}
