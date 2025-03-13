import React from 'react'
import Image from "next/image";
import NavBar from '../NavBar';
import { PortfolioButton } from '../PortfolioButton';
import HomeImg from '../HomeImg';
import { lato, libre } from '@/fonts/fonts';
import { CarouselImg } from '../CarouselImg';
import { ArrowLeft, MoveLeft, MoveRight } from 'lucide-react';

function Photos() {
    return (
        <main className="flex flex-col min-h-screen text-white align-middle justify-center bg-black py-20
          ">
            <div className="flex flex-col  justify-center align-middle w-full">
                <div className='flex w-full justify-around text-center'>
                    <MoveLeft className='text-white size-12' />
                    <h1 className={`${libre.className}  text-5xl font-light my-2 uppercase`}>
                        Hola, soy Catalina!
                    </h1>
                    <MoveRight className='text-white size-12' />
                </div>

                <h2 className={`${lato.className} my-2 m-auto w-fit text-2xl text-white `}>FASHION MODEL | MODEL</h2>

            </div>
            <CarouselImg />
        </main>
    )
}

export default Photos