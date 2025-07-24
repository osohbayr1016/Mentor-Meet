"use client";

import { useState } from "react";
import Image from "next/image";

import { FormData } from "../types/FormTypes";
import Step1BasicInfo from "./Step1BasicInfo";
import Step2AdditionalDetails from "./Step2AdditionalDetails";
import Step3PaymentInfo from "./Step3PaymentInfo";

const FormContainer = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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

  // Validation functions for each step
  const validateStep1 = (): boolean => {
    const {
      firstName,
      lastNameInitial,
      professionalField,
      experience,
      profession,
    } = formData;

    if (!firstName.trim()) {
      setMessage("❌ Нэрээ оруулна уу");
      return false;
    }

    if (!lastNameInitial.trim()) {
      setMessage("❌ Овгийн эхний үсгийг оруулна уу");
      return false;
    }

    if (!professionalField) {
      setMessage("❌ Мэргэжлийн салбараа сонгоно уу");
      return false;
    }

    if (!experience) {
      setMessage("❌ Туршлагаа сонгоно уу");
      return false;
    }

    if (!profession.trim()) {
      setMessage("❌ Мэргэжлээ оруулна уу");
      return false;
    }

    return true;
  };

  const validateStep3 = (): boolean => {
    const { yearExperience, bankAccount } = formData;

    if (!yearExperience) {
      setMessage("❌ Цагийн үнийг сонгоно уу");
      return false;
    }

    if (!bankAccount.bankName) {
      setMessage("❌ Банкаа сонгоно уу");
      return false;
    }

    if (!bankAccount.accountNumber.trim()) {
      setMessage("❌ Дансны дугаараа оруулна уу");
      return false;
    }

    if (!bankAccount.accountName.trim()) {
      setMessage("❌ Данс эзэмшигчийн нэрээ оруулна уу");
      return false;
    }

    return true;
  };

  const handleNext = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setMessage("");

    try {
      // Validate current step
      if (currentStep === 0 && !validateStep1()) {
        return;
      }

      // Clear message on successful validation
      setMessage("");

      // Navigate to next step
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrev = () => {
    if (isLoading) return;

    setMessage(""); // Clear any messages when going back

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalSubmit = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setMessage("");

    try {
      // Validate final step
      if (!validateStep3()) {
        return;
      }

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-20">
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
        <div className="w-full max-w-6xl min-h-[80vh] backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/10 flex flex-col">
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
          <div className="flex-1 overflow-auto">
            {currentStep === 0 && (
              <Step1BasicInfo
                formData={formData}
                setFormData={setFormData}
                onNext={handleNext}
                message={message}
                isLoading={isLoading}
              />
            )}
            {currentStep === 1 && (
              <Step2AdditionalDetails
                formData={formData}
                setFormData={setFormData}
                onNext={handleNext}
                onPrev={handlePrev}
                message={message}
                isLoading={isLoading}
              />
            )}
            {currentStep === 2 && (
              <Step3PaymentInfo
                formData={formData}
                setFormData={setFormData}
                onPrev={handlePrev}
                onSubmit={handleFinalSubmit}
                message={message}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormContainer;
