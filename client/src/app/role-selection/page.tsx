"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const RoleSelectionPage = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRoleSelect = (role: string) => {
    // Store the selected role in localStorage with SSR check
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedRole", role);
    }

    // Direct navigation to signup pages
    if (role === "mentor") {
      router.push("/mentor-signup");
    } else if (role === "student") {
      router.push("/student-signup");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Уншиж байна...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen">
      {/* Background image */}
      <div className="absolute inset-0 bg-black/30 -z-10" />
      <Image
        src="https://images.unsplash.com/photo-1706074740295-d7a79c079562?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="background image"
        fill
        className="absolute inset-0 -z-20 object-cover"
        priority
      />

      {/* Main Role Selection Modal */}
      <div className="relative z-10 w-full min-h-screen flex justify-center items-center p-4 sm:p-6 lg:p-8">
        <motion.div
          className="w-full max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="w-full aspect-[4/3] max-h-[600px] border border-gray-400/50 backdrop-blur-md bg-black/20 flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12">
            {/* Header */}
            <motion.div
              className="flex gap-3 mb-6 sm:mb-8"
              variants={itemVariants}
            >
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <svg
                  className="w-3.5 h-3.5 text-gray-800"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="font-[700] text-lg sm:text-xl lg:text-2xl text-white">
                Mentor Meet
              </p>
            </motion.div>

            {/* Main Content */}
            <motion.div
              className="text-center mb-8 sm:mb-12"
              variants={itemVariants}
            >
              <h2 className="font-[600] text-xl sm:text-2xl lg:text-3xl text-white mb-3 sm:mb-4">
                Бүртгэлийн төрлөө сонгоно уу...
              </h2>
              <p className="text-white/80 text-sm sm:text-base">
                Та суралцагч эсвэл ментор болж бүртгүүлэх боломжтой
              </p>
            </motion.div>

            {/* Role Selection Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8 sm:mb-12 w-full max-w-md mx-auto"
              variants={itemVariants}
            >
              <button
                onClick={() => handleRoleSelect("student")}
                className="flex flex-col items-center gap-3 bg-white text-black px-6 sm:px-8 py-4 sm:py-6 rounded-xl sm:rounded-2xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl flex-1"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    className="sm:w-6 sm:h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="font-[600] text-sm sm:text-base">
                  Суралцагч
                </span>
                <span className="text-xs text-gray-600 text-center">
                  Менторуудаас суралцах
                </span>
              </button>

              <button
                onClick={() => handleRoleSelect("mentor")}
                className="flex flex-col items-center gap-3 bg-white text-black px-6 sm:px-8 py-4 sm:py-6 rounded-xl sm:rounded-2xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl flex-1"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    className="sm:w-6 sm:h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="font-[600] text-sm sm:text-base">Ментор</span>
                <span className="text-xs text-gray-600 text-center">
                  Суралцагчдад заах
                </span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation - Outside the modal */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="backdrop-blur-2xl border-t border-white/10 bg-black/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex justify-center space-x-3 sm:space-x-6">
              <Link
                href="/"
                className="px-4 sm:px-6 py-2 transition-all duration-200 rounded-xl backdrop-blur-sm border text-xs sm:text-sm text-white/70 hover:text-white border-white/20 hover:border-white/40"
              >
                Нүүр хуудас
              </Link>
              <Link
                href="/explore"
                className="px-4 sm:px-6 py-2 transition-all duration-200 rounded-xl backdrop-blur-sm border text-xs sm:text-sm text-white/70 hover:text-white border-white/20 hover:border-white/40"
              >
                Менторууд
              </Link>
              <Link
                href="/auth/signin"
                className="px-4 sm:px-6 py-2 transition-all duration-200 rounded-xl backdrop-blur-sm border text-xs sm:text-sm text-white/70 hover:text-white border-white/20 hover:border-white/40"
              >
                Нэвтрэх
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="fixed bottom-2 left-4 sm:left-6 text-xs text-white/60 z-30">
        <div>Copyright © 2025 Mentor Meet</div>
        <div>All rights reserved.</div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
