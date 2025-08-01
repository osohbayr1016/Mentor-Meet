"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { carouselImages } from "@/lib/cloudinary";

interface CarouselItem {
  id: number;
  imageUrl: string;
  alt: string;
}

const CurvedCarousel = () => {
  const [position, setPosition] = useState(0);

  const carouselItems: CarouselItem[] = carouselImages.map((img) => ({
    id: img.id,
    imageUrl: img.url,
    alt: img.alt,
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => prev + 1); // Very slow movement
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Main carousel container with 3D perspective */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative flex items-center justify-center"
          style={{
            transform: `translateX(${position}px)`,
            transition: "transform 0.05s linear",
            perspective: "1200px",
          }}
        >
          {carouselItems.map((item, index) => {
            const centerIndex = 3; // Center item index
            const distanceFromCenter = index - centerIndex;
            const baseWidth = 400;
            const baseHeight = 300;

            // Calculate 3D positioning like the video
            const scale = Math.max(0.4, 1 - Math.abs(distanceFromCenter) * 0.2);
            const translateX = distanceFromCenter * 450; // Wider spacing
            const translateZ = -Math.abs(distanceFromCenter) * 100; // More depth
            const rotateY = distanceFromCenter * 25; // More rotation for curved effect
            const opacity = Math.max(
              0.2,
              1 - Math.abs(distanceFromCenter) * 0.3
            );

            return (
              <div
                key={item.id}
                className="absolute"
                style={{
                  transform: `
                    translateX(${translateX}px) 
                    translateZ(${translateZ}px) 
                    rotateY(${rotateY}deg)
                    scale(${scale})
                  `,
                  transformStyle: "preserve-3d",
                  opacity: opacity,
                  zIndex: 20 - Math.abs(distanceFromCenter),
                }}
              >
                {/* Image panel with border */}
                <div className="relative bg-white rounded-lg overflow-hidden shadow-2xl border-2 border-gray-800">
                  <div
                    className="relative"
                    style={{
                      width: `${baseWidth}px`,
                      height: `${baseHeight}px`,
                    }}
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 400px) 100vw"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
    </div>
  );
};

export default CurvedCarousel;
