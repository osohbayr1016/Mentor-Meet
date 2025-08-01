"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { HomeCarousel } from "@/app/_components/HomeCarousel";
import { ArrowRight } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";

const Home = () => {
  const router = useRouter();
  const CTAbuttonRouter = () => {
    router.push("/explore");
  };

  return (
    <div className="relative w-screen h-screen">
      <div className="relative w-full h-full">
        <Image
          src="https://images.unsplash.com/photo-1737474707380-5ef35770d8a7?q=80&w=3135&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          fill
          objectFit="cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute overflow-hidden w-[980px] h-150 bg-[#333333]/60 rounded-[20px] backdrop-blur-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/30">
          <div className="flex gap-3 justify-center items-center mt-8">
            <Image
              src="https://res.cloudinary.com/dg2soqaow/image/upload/v1753978167/image_723_nuhvy3.png"
              alt=""
              width={24}
              height={24}
              className="rounded-full"
            />
            <p className="text-white text-[22px] font-bold">Mentor Meet</p>
          </div>
          <div className="flex flex-col gap-2 justify-center items-center mt-6 leading-none">
            <p className="text-[24px] font-semibold text-white">
              Амжилтын замд хамт алхах ментороо ол.
            </p>
            <p className="text-[18px] font-medium text-[#CCCCCC]">
              Чиглүүлэгчээ олоод зорилгынхоо төлөө хөдөл.
            </p>
          </div>
          <div
            className="flex justify-between items-center py-[6px] pl-8 pr-[6px] gap-3 bg-white rounded-full w-fit mx-auto mt-5 group hover:bg-black/90 transition-all duration-400 cursor-pointer"
            onClick={CTAbuttonRouter}
          >
            <p className="text-black text-base font-medium group-hover:text-white">
              Уулзалт товлох
            </p>
            <div className="w-8 h-8 flex justify-center items-center rounded-full bg-[#009812] shadow-md">
              <ArrowRight
                className="w-5 h-5 stroke-white transition-transform duration-300 group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </div>
          </div>
          <HomeCarousel className="z-10 h-fit left-1/2 -translate-x-1/2" />
          <div className="flex flex-row gap-5 justify-center absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="flex flex-col gap-2 w-70">
              <p className="text-base text-white font-semibold text-center">
                Хамтдаа хөгжих менторууд
              </p>
              <p className="text-sm text-white/80 font-regular text-center">
                Таны өсөлтийг дэмжих хүсэлтэй менторууд энд нэг дор.
              </p>
            </div>
            <div className="w-[1px] h-12 bg-white/60"></div>
            <div className="flex flex-col gap-2 w-70">
              <p className="text-base text-white font-semibold text-center">
                Хувь хүнд тохирсон зөвлөгөө
              </p>
              <p className="text-sm text-white/80 font-regular text-center">
                Таны зорилго, салбарт нийцсэн зөвлөгөө, чиглэл өгнө.
              </p>
            </div>
            <div className="w-[1px] h-12 bg-white/60"></div>
            <div className="flex flex-col gap-2 w-70">
              <p className="text-base text-white font-semibold text-center">
                Уулзалт, харилцаа хялбархан
              </p>
              <p className="text-sm text-white/80 font-regular text-center">
                Хэдхэн алхмаар уулзалт товлож, шууд ярилцах боломжтой.
              </p>
            </div>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Home;
