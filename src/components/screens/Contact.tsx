"use client";
import React from "react";
import { lato, libre } from "@/fonts/fonts";
import { FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";

function Contact() {
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Handle form submission
  // };

  return (
    <div id="contact" className="bg-black p-4 md:p-20">
      {/* <motion.h2
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className={`${lato.className} my-2 w-fit text-xl md:text-2xl text-white uppercase pl-4 md:pl-28`}
      >
        Follow | @catabarrionuevo
      </motion.h2> */}

      {/* Instagram Grid */}
      {/* <div className="grid grid-cols-2 md:flex gap-1 p-2 md:p-5 md:px-28">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <motion.div
            key={index}
            className={`aspect-square ${index > 1 ? "hidden md:block" : ""}`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative group cursor-pointer">
              <Image
                src="/cati.jpg"
                alt={`Portfolio image ${index + 1}`}
                width={1143}
                height={1714}
                className="h-full w-full object-cover transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <FaInstagram className="text-white text-3xl" />
              </div>
            </div>
          </motion.div>
        ))}
      </div> */}

      {/* Contact Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full  bg-white min-h-[300px] mx-auto md:ml-auto md:mr-28 flex flex-col justify-center items-center md:items-end p-8 md:p-20"
      >
        <h1 className={`${libre.className} text-4xl md:text-5xl font-light my-2 uppercase text-center`}>Contacto</h1>
        <div className="bg-black w-32 md:w-44 p-0.5 my-4"></div>

        <div className="flex flex-col items-center md:items-end w-full">
          <h2 className={`${lato.className} my-2 w-fit text-xl md:text-2xl uppercase text-center md:text-right`}>Catalina Barrionuevo</h2>
          <a
            href={`mailto:${siteConfig.email}`}
            className={`${lato.className} my-2 w-fit text-lg md:text-2xl uppercase hover:text-gray-600 transition-colors duration-300 text-center md:text-right`}
          >
            {siteConfig.email}
          </a>
          <h2 className={`${lato.className} my-2 w-fit text-xl md:text-2xl uppercase text-center md:text-right`}>Argentina</h2>

          {/* Social Media Links */}
          <div className="flex gap-4 mt-6 justify-center md:justify-end">
            {siteConfig.instagram && (
              <a href={siteConfig.instagram} className="hover:scale-110 transition-transform duration-300">
                <FaInstagram className="text-2xl hover:text-gray-600" />
              </a>
            )}
          </div>

          {/* Contact Form */}
          {/* <form onSubmit={handleSubmit} className="w-full md:w-[40%] mt-8">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full p-2 border border-gray-300 focus:border-black outline-none transition-colors duration-300"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 focus:border-black outline-none transition-colors duration-300"
              />
              <textarea
                placeholder="Message"
                rows={4}
                className="w-full p-2 border border-gray-300 focus:border-black outline-none transition-colors duration-300"
              />
              <button type="submit" className="w-full bg-black text-white py-2 px-4 hover:bg-gray-800 transition-colors duration-300 uppercase">
                Send Message
              </button>
            </div>
          </form> */}
        </div>
      </motion.div>
    </div>
  );
}

export default Contact;
