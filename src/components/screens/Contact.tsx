"use client";
import React from "react";
import { FaInstagram, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";

function Contact() {
  return (
    <div id="contact" className="bg-black p-4 md:p-20">
      {/* Contact Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full bg-white min-h-[300px] mx-auto md:ml-auto md:mr-28 flex flex-col justify-center items-center md:items-end p-8 md:p-20 shadow-lg rounded-sm"
      >
        <h1 className={` text-4xl md:text-5xl font-light my-2 uppercase text-center md:text-right`}>Contacto</h1>
        <div className="bg-black w-32 md:w-44 p-0.5 my-4"></div>

        <div className="flex flex-col items-center md:items-end w-full">
          <div className="flex items-center gap-2 my-3">
            <h2 className={` w-fit text-xl md:text-2xl uppercase text-center md:text-right`}>Catalina Barrionuevo</h2>
          </div>

          <div className="flex items-center gap-2 my-3">
            <a
              href={`mailto:${siteConfig.email}`}
              className={`w-fit text-lg md:text-xl uppercase hover:text-gray-600 transition-colors duration-300 text-center md:text-right flex items-center gap-2 break-all`}
            >
              <FaEnvelope className="text-xl flex-shrink-0" />
              {siteConfig.email}
            </a>
          </div>

          <div className="flex items-center gap-2 my-3">
            <FaMapMarkerAlt className="text-xl" />
            <h2 className={`w-fit text-xl md:text-2xl uppercase text-center md:text-right`}>Argentina</h2>
          </div>

          {/* Social Media Links */}
          <div className="flex gap-4 mt-8 justify-center md:justify-end">
            {siteConfig.instagram && (
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform duration-300 bg-black text-white p-3 rounded-full"
              >
                <FaInstagram className="text-2xl" />
              </a>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 text-center md:text-right"
          >
            <p className={` text-gray-600 italic`}>Para consultas y colaboraciones, no dudes en contactarme</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Contact;
