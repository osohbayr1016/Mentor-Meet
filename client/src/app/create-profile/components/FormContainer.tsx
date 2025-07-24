"use client";

import { useState } from "react";
import Image from "next/image";
import Step1BasicInfo from "./Step1BasicInfo";
import Step2AdditionalDetails from "./Step2AdditionalDetails";
import Step3PaymentInfo from "./Step3PaymentInfo";
import { FormData } from "../types/FormTypes";

const FormContainer = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastNameInitial: "",
    nickname: "",
    showNickname: false,
    professionalField: "",
    experience: "",
    profession: "",
    bio: "",
    profileImage: null,
    // Step 2 fields
    description: "",
    socialLinks: {
      website: "",
      linkedin: "",
      twitter: "",
      github: "",
    },
    specialization: "",
    achievements: "",
    // Step 3 fields
    bankAccount: {
      bankName: "",
      accountNumber: "",
      accountName: "",
    },
    yearExperience: "",
  });

  const [message, setMessage] = useState("");

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/mentors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("✅ Профайл амжилттай үүсгэгдлээ!");
      } else {
        setMessage("❌ " + result.message);
      }
    } catch (error) {
      setMessage("❌ Алдаа гарлаа. Дахин оролдоно уу.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1706074740295-d7a79c079562?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-[980px] h-[600px] backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/10">
          {/* Header */}
          <div className="text-center py-4 px-6 border-b border-white/20">
            {/* Logo and Title */}
            <div className="flex items-center justify-center gap-3 mb-3">
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
              <h1 className="font-bold text-lg text-white">Mentor Meet</h1>
            </div>

            {/* Subtext */}
            <h2 className="text-white text-base mb-3 font-medium">
              Таны профайл үүсэж байна...
            </h2>

            {/* Step Progress Bar */}
            <div className="flex justify-center items-center gap-2">
              <div
                className={`h-1 w-8 rounded-full ${
                  currentStep >= 0 ? "bg-white" : "bg-gray-500"
                }`}
              ></div>
              <div
                className={`h-1 w-8 rounded-full ${
                  currentStep >= 1 ? "bg-white" : "bg-gray-500"
                }`}
              ></div>
              <div
                className={`h-1 w-8 rounded-full ${
                  currentStep >= 2 ? "bg-white" : "bg-gray-500"
                }`}
              ></div>
            </div>
          </div>

          {/* Form Steps */}
          <div className="h-[calc(600px-140px)]">
            {currentStep === 0 && (
              <Step1BasicInfo
                formData={formData}
                setFormData={setFormData}
                onNext={handleNext}
                message={message}
              />
            )}
            {currentStep === 1 && (
              <Step2AdditionalDetails
                formData={formData}
                setFormData={setFormData}
                onNext={handleNext}
                onPrev={handlePrev}
                message={message}
              />
            )}
            {currentStep === 2 && (
              <Step3PaymentInfo
                formData={formData}
                setFormData={setFormData}
                onPrev={handlePrev}
                onSubmit={handleFinalSubmit}
                message={message}
              />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="backdrop-blur-2xl border-t border-white/10">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex justify-center space-x-6">
              <button className="px-6 py-2 text-white/70 hover:text-white transition-colors rounded-xl backdrop-blur-sm border border-white/20 hover:border-white/40 text-sm">
                Нүүр хуудас
              </button>
              <button className="px-6 py-2 text-white/70 hover:text-white transition-colors rounded-xl backdrop-blur-sm border border-white/20 hover:border-white/40 text-sm">
                Менторууд
              </button>
              <button className="px-6 py-2 bg-white/20 text-white font-medium rounded-xl backdrop-blur-sm border border-white/50 hover:border-white/70 text-sm">
                Бүртгүүлэх
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="absolute bottom-2 left-6 text-xs text-white/60 z-20">
        <div>Copyright © 2025 Mentor Meet</div>
        <div>All rights reserved.</div>
      </div>
    </div>
  );
};

export default FormContainer;
