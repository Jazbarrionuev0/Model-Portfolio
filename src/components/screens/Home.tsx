import React from 'react'
import Image from "next/image";
import NavBar from '../NavBar';
import { PortfolioButton } from '../PortfolioButton';
import HomeImg from '../HomeImg';
import { lato, libre } from '@/fonts/fonts';

function HomePage() {
    return (
        <main className="flex min-h-screen bg-black text-white">

            <div className="flex-1 ml-24">
                <div className="grid grid-cols-[1fr,auto] gap-8 h-screen">
                    {/* Left Content */}
                    <div className="flex flex-col justify-center px-16 max-w-2xl">
                        <h2 className={`${lato.className} text-2xl text-white/70 mb-4`}>FASHION MODEL</h2>
                        <h1 className={`${libre.className} font-playfair text-7xl font-light tracking-wide mb-12 leading-tight`}>
                            CATALINA
                            <br />
                            BARRIONUEVO
                        </h1>
                        <PortfolioButton />
                    </div>

                    {/* Rigth Content */}
                    <div className="grid grid-cols-1 gap-4 h-screen overflow-hidden">
                        <HomeImg />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default HomePage