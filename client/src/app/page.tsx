"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

const Home = () => {
  return (
    <div className="relative w-screen h-screen">
      <div></div>
      <div className="relative w-full h-full">
        <Image
          src="https://images.unsplash.com/photo-1737474707380-5ef35770d8a7?q=80&w=3135&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="home-background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="w-full h-full bg-black/40 absolute inset-0"></div>
      </div>
    </div>
  );
};

export default Home;
