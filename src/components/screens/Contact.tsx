import React from 'react'
import Image from "next/image";
import { lato, libre } from '@/fonts/fonts';

function Contact() {
    return (
        <div id='contact' className=' bg-black p-20'>

            <h2 className={`${lato.className} my-2 w-fit text-2xl text-white uppercase pl-28`}>Follow | @catabarrionuevo</h2>
            <div className='flex gap-1 p-5 px-28'>
                <div className='aspect-square'>
                    <Image
                        src="/cati.jpg"
                        alt="Portfolio image 2"
                        width={1143}
                        height={1714}
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className='aspect-square'>
                    <Image
                        src="/cati.jpg"
                        alt="Portfolio image 2"
                        width={1143}
                        height={1714}
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className='aspect-square'>
                    <Image
                        src="/cati.jpg"
                        alt="Portfolio image 2"
                        width={1143}
                        height={1714}
                        className="h-full w-full object-cover"
                    />
                </div>

                <div className='aspect-square'>
                    <Image
                        src="/cati.jpg"
                        alt="Portfolio image 2"
                        width={1143}
                        height={1714}
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className='aspect-square'>
                    <Image
                        src="/cati.jpg"
                        alt="Portfolio image 2"
                        width={1143}
                        height={1714}
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
            <div className='aspect-square w-[40%] bg-white h-[300px] ml-auto gap-3 flex flex-col mr-28 justify-center items-end p-20'>
                <h1 className={`${libre.className}  text-5xl font-light my-2 uppercase text-center`}>
                    Contacto
                </h1>
                <div className='bg-black w-44 p-0.5'></div>
                <div className='flex flex-col items-end'>
                    <h2 className={`${lato.className} my-2 w-fit text-2xl  uppercase `}>Catalina Barrionuevo</h2>
                    <h2 className={`${lato.className} my-2 w-fit text-2xl  uppercase `}>catalinabarrionuevo6@gmail.com</h2>
                    <h2 className={`${lato.className} my-2 w-fit text-2xl  uppercase `}>Argentina</h2>
                </div>



            </div>

        </div>
    )
}

export default Contact