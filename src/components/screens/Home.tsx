"use client";

import React, { useState, useEffect, useRef } from "react";
import { Instagram } from "lucide-react";
import Image from "next/image";
import { Profile } from "@/types/profile";
import { Image as ImageType } from "@/types/image";

const HeroSection = ({ profile, images }: { profile: Profile; images: ImageType[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined" || !sectionRef.current || !contentRef.current) return;

      const { top, bottom, height } = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const isInView = top < viewportHeight && bottom > 0;

      if (isInView) {
        const scrollProgress = Math.max(0, Math.min(1, -top / height));

        contentRef.current.style.transform = `translateY(${scrollProgress * 30}px)`;
        contentRef.current.style.opacity = `${1 - scrollProgress * 0.5}`;
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const nameParts = profile.name.split(" ");

  return (
    <section ref={sectionRef} className="relative w-full min-h-dvh overflow-hidden flex items-center justify-center" style={{ zIndex: 0 }}>
      <div className="absolute inset-0 z-0">
        {images.map((image, idx) => (
          <div
            key={image.id}
            className="absolute inset-0 transition-all duration-1500"
            style={{
              opacity: idx === activeIndex ? 1 : 0,
              visibility: idx === activeIndex ? "visible" : "hidden",
              transition: "opacity 1.5s ease, visibility 1.5s ease",
            }}
          >
            <Image src={image.url} alt={image.alt} fill priority={idx === 0} className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
          </div>
        ))}
      </div>

      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: `translateY(${isVisible ? 0 : "30px"})`,
          transition: "opacity 0.8s ease, transform 1s ease",
        }}
      >
        <div className="w-full max-w-xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 overflow-hidden">
            <span className="inline-block">
              {nameParts.map((letter, idx) => (
                <span
                  key={idx}
                  className="inline-block"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: `translateY(${isVisible ? 0 : "40px"})`,
                    transition: `opacity 0.5s ease ${idx * 0.05}s, transform 0.5s ease ${idx * 0.05}s`,
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </span>
              ))}
            </span>
          </h1>

          <div
            className="h-1 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-6"
            style={{
              width: isVisible ? "80%" : "0%",
              maxWidth: "320px",
              transition: "width 1.2s cubic-bezier(0.65, 0, 0.35, 1) 0.5s",
            }}
          />

          <p
            className="text-xl text-blue-300 font-medium mb-6"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: `translateY(${isVisible ? 0 : "20px"})`,
              transition: "opacity 0.8s ease 0.7s, transform 0.8s ease 0.7s",
            }}
          >
            {profile.occupation}
          </p>

          <p
            className="text-gray-200 text-lg mb-8 max-w-lg mx-auto"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: `translateY(${isVisible ? 0 : "20px"})`,
              transition: "opacity 0.8s ease 0.9s, transform 0.8s ease 0.9s",
            }}
          >
            {profile.description}
          </p>

          <div
            className="flex justify-center"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: `translateY(${isVisible ? 0 : "20px"})`,
              transition: "opacity 0.8s ease 1.1s, transform 0.8s ease 1.1s",
            }}
          >
            <a
              href={`https://instagram.com/${profile.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 w-fit px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500 hover:to-pink-500 border border-white/10 hover:border-white/30 transition-all duration-300"
            >
              <Instagram className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
              <span className="text-white font-medium">@{profile.instagram}</span>
            </a>
          </div>
        </div>

        <div
          className="absolute bottom-8 flex gap-2"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.8s ease 1.3s",
          }}
        >
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeIndex ? "w-8 bg-white" : "bg-white/40 hover:bg-white/70"}`}
              aria-label={`View image ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-0" />
    </section>
  );
};

export default HeroSection;
