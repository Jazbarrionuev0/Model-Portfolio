import { plus, zen } from '@/fonts/fonts'
import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

function CardEmail() {
    return (
        <div className='flex flex-col background w-[70%] rounded-3xl m-14 p-14 justify-center items-center gap-5 text-white'>
            <h1 className={`${zen.className} text-3xl text-center`}>
                Ready to digitalize your restaurant?                </h1>
            <p className={`${plus.className}`}>Send us your info and we will be contacting you soon.</p>
            <div className="flex w-full max-w-sm items-center space-x-2 relative">
                <Input type="email" placeholder="Email" className='p-6  rounded-3xl' />
                <Button className='absolute right-2 rounded-3xl' type="submit">Send</Button>
            </div>
        </div>
    )
}

export default CardEmail