import React from 'react'
import Image from "next/image";

function HomeImg() {
    return (
        <div className='w-full h-full flex gap-1'>
            <div className=" w-2/3">
                <Image
                    src="/cati.jpg"
                    alt="Portfolio image 1"
                    width={500}
                    height={800}
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="h-2/3  w-1/3">
                <Image
                    src="/cati.jpg"
                    alt="Portfolio image 2"
                    width={500}
                    height={800}
                    className="h-full w-full object-cover"
                />
            </div></div>
    )
}

export default HomeImg