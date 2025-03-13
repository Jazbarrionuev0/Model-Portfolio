"use client"

import { useState } from "react"
import Image from "next/image"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface ImageWithPopupProps {
    src: string
    alt: string
    width: number
    height: number
}

export function ImagePopUp({ src, alt, width, height }: ImageWithPopupProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="cursor-pointer m-10">
                    <Image
                        src={src}
                        alt={alt}
                        width={width}
                        height={height}
                        className="rounded-sm transition-transform hover:scale-105"
                    />
                </div>
            </DialogTrigger>
            <DialogContent className=" p-0 scale-150">
                <VisuallyHidden asChild>
                    <DialogTitle className=""></DialogTitle></VisuallyHidden>
                <div className="relative ">
                    <Image
                        src={src}
                        alt={alt}
                        layout="responsive"
                        width={width}
                        height={height}
                        className="rounded-sm object-contain"
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

