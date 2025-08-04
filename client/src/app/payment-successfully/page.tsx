"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { PartyPopper } from "lucide-react";

const MentorCalendar = () => {
  return (
    <div className="relative w-full h-screen">
      <div className="absolute inset-0 bg-black/30 -z-10" />
      <Image
        src="/home.jpg"
        alt="background image"
        fill
        className="absolute inset-0 -z-20 object-cover"
      />

      <div className="relative z-10 w-full h-full flex justify-center items-center">
        <div className="w-6/10 h-7/10 flex items-center justify-center">
          <div className="w-full h-full border-gray-400/50 border-1 backdrop-blur-lg bg-black/30 flex flex-col items-center rounded-[20px]">
            <div className="h-[140px] flex flex-col items-center justify-between pt-[40px]">
              <div className="flex gap-3 pb-[30px]">
                <Image
                  src="/image709.png"
                  alt="Mentor Meet Logo"
                  width={29}
                  height={24}
                />
                <p className="font-[700] text-[22px] text-white">Mentor Meet</p>
              </div>
            </div>

            <div className="w-full h-full flex flex-col justify-center items-center px-8">
              <div className="w-full max-w-[500px] flex flex-col gap-[20px]">
                <div className="flex flex-col gap-[20px] text-center justify-center items-center ">
                  <p className="font-medium text-[18px] text-white text-center">
                    Таны төлбөр амжилттай төлөгдөж уулзалт баталгаажлаа!
                  </p>
                  <p className="text-[#009812] ">
                    {" "}
                    <PartyPopper />
                  </p>
                  <div className="flex justify-between gap-[10px]"></div>
                </div>

                <div className="flex flex-col gap-[20px]">
                  <p className="font-semibold text-[18px] text-white text-center">
                    Уулзалтын өдөр та “ПРОФАЙЛ” хэсгээс хурлын холбоосыг авна
                    уу.
                  </p>
                  <div className="flex justify-between gap-[10px]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-2 left-6 text-xs text-white/60 z-30">
        <div>Copyright © 2025 Mentor Meet</div>
        <div>All rights reserved.</div>
      </div>
    </div>
  );
};

export default MentorCalendar;
