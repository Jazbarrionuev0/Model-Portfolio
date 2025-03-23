"use client";
import React, { useState, useEffect, useRef } from "react";
import { PortfolioButton } from "../hero/PortfolioButton";
import HomeImg from "../hero/HomeImg";
import { lato, libre } from "@/fonts/fonts";
import { AdminButton } from "../hero/AdminButton";
import { Image } from "@/types/image";
import { motion } from "framer-motion";

function HomePage({ images }: { images: Image[] }) {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const firstSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current && firstSectionRef.current) {
        // Get the bottom position of the first section
        const firstSectionBottom = firstSectionRef.current.getBoundingClientRect().bottom;

        // If the bottom of the first section is above the viewport, we're in section 2
        // Using a small offset to trigger the change earlier for smoother transition
        setActiveSection(firstSectionBottom < 100 ? 1 : 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mobileBackgroundImages = images.slice(0, 2);

  return (
    <>
      <div className="hidden md:block">
        {/* Desktop layout remains unchanged */}
        <main className="min-h-screen bg-black text-white overflow-hidden">
          <div className="fixed inset-0 flex items-center justify-center opacity-5 pointer-events-none z-0">
            <h1 className={`${libre.className} text-[20vw] font-light tracking-widest`}>CATALINA</h1>
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row min-h-screen">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col justify-center px-8 md:px-16 py-12 md:py-0 md:w-1/2 md:sticky md:top-0 md:h-screen"
              >
                {/* Desktop content */}
                <div className="max-w-md mx-auto md:mx-0">
                  <h2 className={`${lato.className} text-xl md:text-2xl text-white/90 mb-2 md:mb-4 tracking-widest font-semibold`}>
                    MODELO | INFLUENCER
                  </h2>
                  <h1
                    className={`${libre.className} text-4xl md:text-7xl font-light tracking-wide mb-8 md:mb-12 leading-tight text-white drop-shadow-lg`}
                  >
                    CATALINA
                    <br />
                    <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-purple-500 drop-shadow-lg">
                      BARRIONUEVO
                    </span>
                  </h1>

                  <div className="flex flex-col md:flex-row gap-4">
                    <PortfolioButton />
                    <AdminButton />
                  </div>

                  <div className="mt-12 hidden md:flex gap-6">
                    <a href="#" className="text-white hover:text-rose-400 transition-colors font-medium">
                      Instagram
                    </a>
                    <a href="#" className="text-white hover:text-rose-400 transition-colors font-medium">
                      Agencia
                    </a>
                    <a href="#" className="text-white hover:text-rose-400 transition-colors font-medium">
                      Contacto
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="md:w-1/2 h-[70vh] md:h-auto"
              >
                <div className="h-full md:py-16 md:px-8">
                  <div className="h-full md:h-auto md:min-h-screen overflow-hidden relative">
                    <HomeImg heroImages={images} />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Layout with improved section transition */}
      <div className="md:hidden bg-black" ref={containerRef}>
        {/* Fixed Background Images Container with increased opacity overlay */}
        <div className="fixed inset-0 z-0">
          {/* First section background image */}
          {mobileBackgroundImages.length > 0 && (
            <div 
              className={`absolute inset-0 transition-opacity duration-1000 ${
                activeSection === 0 ? "opacity-100" : "opacity-0"
              }`}
            >
              <img 
                src={mobileBackgroundImages[0].url} 
                alt="Fondo principal" 
                className="h-full w-full object-cover object-center" 
              />
              <div className="absolute inset-0 bg-black/65"></div>
            </div>
          )}

          {/* Second section background image */}
          {mobileBackgroundImages.length > 1 && (
            <div 
              className={`absolute inset-0 transition-opacity duration-1000 ${
                activeSection === 1 ? "opacity-100" : "opacity-0"
              }`}
            >
              <img 
                src={mobileBackgroundImages[1].url} 
                alt="Fondo secundario" 
                className="h-full w-full object-cover object-center" 
              />
              <div className="absolute inset-0 bg-black/65"></div>
            </div>
          )}
        </div>

        {/* First Section - Name and Info */}
        <section ref={firstSectionRef} className="relative h-screen">
          {/* Rest of the first section remains unchanged */}
          <div className="relative z-10 flex flex-col justify-end h-full pb-16 px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white drop-shadow-xl"
            >
              <h2 className={`${lato.className} text-xl text-white mb-2 tracking-widest font-semibold`}>MODELO | INFLUENCER</h2>
              <h1 className={`${libre.className} text-5xl font-light tracking-wide mb-6 leading-tight`}>
                CATALINA
                <br />
                <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-purple-500 drop-shadow-lg">
                  BARRIONUEVO
                </span>
              </h1>

              {/* Added animated indicator to encourage scrolling */}
              <div className="flex flex-col items-center mt-12">
                <p className="text-white/80 italic mb-4">Desliza hacia abajo para más opciones</p>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-1"
                >
                  <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-1.5 h-1.5 bg-white rounded-full"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Second Section - Links */}
        <section className="relative h-screen">
          <div className="relative z-10 flex flex-col justify-center h-full px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center text-white drop-shadow-xl"
            >
              <h2 className={`${libre.className} text-3xl font-light mb-10`}>Explora Mi Trabajo</h2>

              <div className="flex flex-col gap-6 mb-10">
                <a
                  href="/portfolio"
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white py-4 px-8 rounded-full transition-all duration-300 text-lg font-medium border border-white/30 flex items-center justify-center"
                >
                  Ver Portafolio Completo
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-4 px-8 rounded-full transition-all duration-300 text-lg font-medium flex items-center justify-center"
                >
                  Sígueme en Instagram
                </a>
              </div>

              <div className="mt-10">
                <AdminButton />
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}

export default HomePage;
