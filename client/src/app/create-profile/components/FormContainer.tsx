"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { useAuth } from "../../_components/MentorUserProvider";
import { FormData } from "../types/FormTypes";
import {
  uploadImageToCloudinary,
  validateImageFile,
} from "../../../lib/cloudinary";
import Step1BasicInfo from "./Step1BasicInfo";
import Step2AdditionalDetails from "./Step2AdditionalDetails";
import Step3PaymentInfo from "./Step3PaymentInfo";

interface Category {
  _id: string;
  categoryName: string;
}

const FormContainer = () => {
  const { mentor, isLoading: authLoading, checkAuth } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    lastNameInitial: "",
    nickName: "",
    nickname: "",
    showNickName: false,
    showNickname: false,
    category: "",
    careerDuration: "",
    profession: "",
    bio: "",
    image: null,
    profileImage: null,
    professionalField: "",
    subcategory: "",
    experience: "",
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

  const uploadImage = async (file: File): Promise<string> => {
    if (!file) {
      throw new Error("No file provided");
    }

    // Validate file using helper function
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error || "Invalid file");
    }

    setIsUploadingImage(true);
    setMessage("Зураг хуулж байна...");

    try {
      const imageUrl = await uploadImageToCloudinary(file);

      setUploadedImageUrl(imageUrl);
      setMessage("✅ Зураг амжилттай хуулагдлаа!");

      return imageUrl;
    } catch (err) {
      console.error("Failed to upload image:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Зургийн хуулалт амжилтгүй болсон";
      setMessage("❌ " + errorMessage);
      throw err;
    } finally {
      setIsUploadingImage(false);
    }
  };
  // Load categories when component mounts
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(
          "http://https://mentor-meet-o3rp.onrender.com/mentor-get-category"
        );
        const result = await response.json();

        if (response.ok && result.categories) {
          setCategories(result.categories);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    loadCategories();
  }, []);

  // Map professional field to category ID
  const getCategoryId = (professionalField: string): string => {
    // Map frontend professional fields to backend category names
    const fieldMapping: { [key: string]: string } = {
      technology: "технологи",
      education: "боловсрол",
      healthcare: "эрүүл мэнд",
      business: "бизнес",
      engineering: "инженерчлэл",
      design: "дизайн",
      marketing: "маркетинг",
      finance: "санхүү",
    };

    const categoryName = fieldMapping[professionalField];
    const category = categories.find((cat) =>
      cat.categoryName.toLowerCase().includes(categoryName?.toLowerCase() || "")
    );

    // Return category ID or default to first category
    return category?._id || categories[0]?._id || "000000000000000000000001";
  };

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

  const validateAllSteps = (): boolean => {
    // Validate Step 1
    if (!validateStep1()) {
      return false;
    }

    // Validate Step 3 (Step 2 is optional)
    if (!validateStep3()) {
      return false;
    }

    return true;
  };

  const handleNext = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setMessage("");

    try {
      if (currentStep === 0) {
        // Validate step 1
        if (!validateStep1()) {
          return;
        }

        // Upload image if provided
        let imageUrl = "";
        if (formData.profileImage) {
          try {
            imageUrl = await uploadImage(formData.profileImage);
          } catch (error) {
            console.error("Image upload failed:", error);
            setMessage("❌ Зургийн хуулалт амжилтгүй болсон");
            return;
          }
        }

        // Get authentication token
        const token = localStorage.getItem("mentorToken");
        if (!token || !mentor) {
          setMessage("❌ Нэвтэрч орох шаардлагатай!");
          return;
        }

        // Call Step 1 API
        const response = await fetch(
          "http://https://mentor-meet-o3rp.onrender.com/mentorProfile/step1",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              firstName: formData.firstName,
              lastName: formData.lastNameInitial,
              nickName: formData.nickname || "",
              profession: formData.profession,
              careerDuration: formData.experience,
              image: imageUrl, // Use the uploaded image URL
              category: {
                categoryId: getCategoryId(formData.professionalField),
                price: 0, // Default price, will be set in Step 3
              },
            }),
          }
        );

        const result = await response.json();

        if (response.ok) {
          setMessage("✅ Алхам 1 амжилттай хадгалагдлаа!");
          setTimeout(() => {
            setCurrentStep(1);
            setMessage("");
          }, 1000);
        } else {
          setMessage("❌ " + (result.message || "Алдаа гарлаа"));
        }
      } else if (currentStep === 1) {
        // No validation needed for step 2 (optional fields)

        // Get authentication token
        const token = localStorage.getItem("mentorToken");
        if (!token || !mentor) {
          setMessage("❌ Нэвтэрч орох шаардлагатай!");
          return;
        }

        // Call Step 2 API
        const response = await fetch(
          "http://https://mentor-meet-o3rp.onrender.com/mentorProfile/step2",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              bio: formData.bio,
              description: formData.description,
              socialLinks: formData.socialLinks,
              specialization: formData.specialization,
              achievements: formData.achievements,
            }),
          }
        );

        const result = await response.json();

        if (response.ok) {
          setMessage("✅ Алхам 2 амжилттай хадгалагдлаа!");
          setTimeout(() => {
            setCurrentStep(2);
            setMessage("");
          }, 1000);
        } else {
          setMessage("❌ " + (result.message || "Алдаа гарлаа"));
        }
      }
    } catch (error) {
      setMessage("❌ Алдаа гарлаа. Дахин оролдоно уу.");
      console.error("Error:", error);
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
      // Validate all steps
      if (!validateAllSteps()) {
        return;
      }

      // Get authentication token
      const token = localStorage.getItem("mentorToken");
      if (!token || !mentor) {
        setMessage("❌ Нэвтэрч орох шаардлагатай!");
        return;
      }

      // Call Step 3 API
      const response = await fetch(
        "http://https://mentor-meet-o3rp.onrender.com/mentorProfile/step3",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category: {
              price: parseInt(formData.yearExperience) || 0,
            },
            bankAccount: formData.bankAccount,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage("✅ Профайл амжилттай үүсгэгдлээ!");
        // Optionally redirect to dashboard or home page
        setTimeout(() => {
          window.location.href = "/"; // Or use router.push("/")
        }, 2000);
      } else {
        setMessage("❌ " + (result.message || "Алдаа гарлаа"));
      }
    } catch (error) {
      setMessage("❌ Алдаа гарлаа. Дахин оролдоно уу.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Нэвтрэлт шалгаж байна...</p>
        </div>
      </div>
    );
  }

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
                isLoading={isLoading || isUploadingImage}
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
