import { lato, libre } from '@/fonts/fonts'
import { Minus } from 'lucide-react'
import React from 'react'
import { CarouselImg } from '../CarouselImg'
import Link from 'next/link'

function GoToPortfolio() {
    return (
        <div className='bg-white'>
            <div className=' flex gap-60 m-10 justify-center items-center'>

                <div>
                    <div className='flex gap-2 items-center'>
                        <h1 className={`${libre.className}  text-xl font-light my-2 uppercase`}>
                            Ve mis trabajos
                        </h1>
                        <div className='bg-black w-20 h-[2]'></div>
                    </div>

                    <h1 className={`${libre.className}  text-5xl font-light my-2 uppercase`}>
                        Lifestyle
                    </h1>
                </div>
                <Link href="/Portfolio"> <button className={`${lato.className} hover:bg-[#eee0bc] bg-[#E3D2A8] p-5 px-10 uppercase h-fit text-xl`}>Ver Portfolio</button></Link>
            </div>
            <CarouselImg />
        </div>

    )
}

export default GoToPortfolio