import React from 'react'
import Image from "next/image";
import { lato, libre } from '@/fonts/fonts';

function AboutMe() {
    return (
        <div className='flex justify-center h-screen relative align-middle'>
            <div className='aspect-square w-[50%] bg-white h-[50%] m-auto flex flex-col justify-center p-20'>
                <h1 className={`${libre.className}  text-5xl font-light my-2 uppercase text-center`}>
                    Hola, soy Catalina! Modelo y nose
                </h1>
                <p className={`${lato.className} my-2 m-auto w-fit text-2xl  `}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum quo quasi beatae, doloremque pariatur voluptatibus voluptates consequuntur tempore quam reiciendis excepturi, aut unde, rerum eligendi omnis maiores enim error corrupti?orem ipsum dolor sit amet consectetur adipisicing elit. Ipsum quo quasi beatae, doloremque pariatur voluptatibus voluptates consequuntur tempore quam reiciendis excepturi, aut unde, rerum eligendi omnis maiores enim error corrupti?orem ipsum dolor sit amet consectetur adipisicing elit. Ipsum quo quasi beatae, doloremque pariatur voluptatibus voluptates consequuntur tempore quam reiciendis excepturi, aut unde, rerum eligendi omnis maiores enim error corrupti?</p>
            </div>
            <Image
                className="w-full h-screen -z-20 absolute top-0 left-0 object-cover"
                src={"/catihorizontal.jpg"}
                alt="background image"
                width={2571}
                height={1714}
            /></div>
    )
}

export default AboutMe