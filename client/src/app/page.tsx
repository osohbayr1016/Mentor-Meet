"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to role selection page
    router.push("/role-selection");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">Уншиж байна...</div>
    </div>
  );
};

export default Home;
