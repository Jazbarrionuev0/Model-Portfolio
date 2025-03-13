import React from 'react'
import Image from "next/image";

function Images() {
    return (
        <div className='m-10'>   <Image
            src="/cati.jpg"
            alt="Portfolio image 2"
            width={500}
            height={800}
            className="h-full w-full object-cover"
        /></div>
    )
}

export default Images