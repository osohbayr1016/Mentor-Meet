import React from "react";
import Image from "next/image";

interface HomeCarouselProps {
  images?: string[];
  className?: string;
}

export const HomeCarousel: React.FC<HomeCarouselProps> = ({
  images = [
    "https://res.cloudinary.com/dg2soqaow/image/upload/v1753974855/Gemini_Generated_Image_txkq5ntxkq5ntxkq_qfdwvl.png",
    "https://res.cloudinary.com/dg2soqaow/image/upload/v1753974244/ChatGPT_Image_Jul_31_2025_10_45_46_PM_tre9k4.png",
    "https://res.cloudinary.com/dg2soqaow/image/upload/v1753974636/ChatGPT_Image_Jul_31_2025_10_50_25_PM_u8uxbj.png",
    "https://res.cloudinary.com/dg2soqaow/image/upload/v1753974319/Gemini_Generated_Image_lhu3otlhu3otlhu3_ahd9ed.png",
    "https://res.cloudinary.com/dg2soqaow/image/upload/v1753974356/Gemini_Generated_Image_qla7oqla7oqla7oq_r2ayhx.png",
    "https://res.cloudinary.com/dg2soqaow/image/upload/v1753974852/Gemini_Generated_Image_3imptn3imptn3imp_io3u0u.png",
    "https://res.cloudinary.com/dg2soqaow/image/upload/v1753974255/ChatGPT_Image_Jul_31_2025_10_47_56_PM_sxectd.png",
    "https://res.cloudinary.com/dg2soqaow/image/upload/v1753979309/Gemini_Generated_Image_t7kfzmt7kfzmt7kf_otvxg3.png",
    "https://res.cloudinary.com/dg2soqaow/image/upload/v1753974314/Gemini_Generated_Image_wjrpvjwjrpvjwjrp_y76ekw.png",
    "https://res.cloudinary.com/dg2soqaow/image/upload/v1753974295/ChatGPT_Image_Jul_31_2025_10_48_59_PM_jyukuz.png",
  ],
  className = "",
}) => {
  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images];

  return (
    <div className={`carousel-container ${className}`}>
      <div className="carousel-track">
        {duplicatedImages.map((image, index) => (
          <div key={index} className="carousel-item">
            <img
              src={image}
              alt={`Carousel image ${(index % images.length) + 1}`}
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        .carousel-container {
          width: 964px;
          max-width: 964px;
          overflow: hidden;
          position: relative;
          border-radius: 20px;
        }

        .carousel-track {
          display: flex;
          width: calc(200px * ${duplicatedImages.length});
          animation: scroll 80s linear infinite;
          transition: animation-duration 0.5s ease;
        }

        .carousel-item {
          min-width: 200px;
          height: 240px;
          margin: 20px 10px;
          border-radius: 15px;
          overflow: hidden;
          position: relative;
        }

        .carousel-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
        }

        // @keyframes scroll {
        //   0% {
        //     transform: translateX(0);
        //   }
        //   100% {
        //     transform: translateX(calc(-200px * ${images.length}));
        //   }
        // }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};
