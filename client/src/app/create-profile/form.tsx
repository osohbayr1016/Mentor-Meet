"use client";

import { useState } from "react";
import Image from "next/image";

const SimpleProfileForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastNameInitial: "",
    nickname: "",
    showNickname: true,
    professionalField: "",
    experience: "",
    profession: "",
    bio: "",
    profileImage: null as File | null,
  });

  const [message, setMessage] = useState("");

  const professionalFields = [
    "Мэргэжлийн салбар сонгох",
    "Технологи",
    "Боловсрол",
    "Эрүүл мэнд",
    "Бизнес",
    "Инженерчлэл",
    "Дизайн",
    "Маркетинг",
    "Санхүү",
  ];

  const experienceOptions = [
    "Туршлага сонгох",
    "1-2 жил",
    "3-5 жил",
    "5-10 жил",
    "10+ жил",
  ];

  const steps = [
    { id: 1, title: "Үндсэн мэдээлэл", desc: "Таны нэр, овог" },
    { id: 2, title: "Мэргэжлийн мэдээлэл", desc: "Туршлага, мэргэжил" },
    { id: 3, title: "Профайл зураг", desc: "Таны зураг, тайлбар" },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, profileImage: file }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        // Reset form
      } else {
        setMessage("❌ " + result.message);
      }
    } catch (error) {
      setMessage("❌ Алдаа гарлаа. Дахин оролдоно уу.");
      console.error("Error:", error);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-white mb-3">
          Нэр <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-white placeholder-white/50 backdrop-blur-sm"
          placeholder="Нэрээ оруулна уу"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-white mb-3">
          Овгийн эхний үсэг <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="lastNameInitial"
          value={formData.lastNameInitial}
          onChange={handleChange}
          required
          maxLength={1}
          className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-white placeholder-white/50 backdrop-blur-sm"
          placeholder="Ж.м: А"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-white">
            Дуудаж нэрлэх нэр
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="showNickname"
              checked={formData.showNickname}
              onChange={handleChange}
              className="w-4 h-4 text-yellow-400 bg-transparent border-white/30 rounded focus:ring-yellow-400"
            />
            <span className="text-sm text-white/70">Харуулах</span>
          </label>
        </div>
        <input
          type="text"
          name="nickname"
          value={formData.nickname}
          onChange={handleChange}
          className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-white placeholder-white/50 backdrop-blur-sm"
          placeholder="Таны дуудаж нэрлэх нэр"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-white mb-3">
          Мэргэжлийн салбар <span className="text-red-400">*</span>
        </label>
        <select
          name="professionalField"
          value={formData.professionalField}
          onChange={handleChange}
          required
          className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-white appearance-none backdrop-blur-sm"
        >
          {professionalFields.map((field, index) => (
            <option
              key={index}
              value={field}
              className="bg-gray-800 text-white"
            >
              {field}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-white mb-3">
          Туршлага <span className="text-red-400">*</span>
        </label>
        <select
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          required
          className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-white appearance-none backdrop-blur-sm"
        >
          {experienceOptions.map((exp, index) => (
            <option key={index} value={exp} className="bg-gray-800 text-white">
              {exp}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-white mb-3">
          Мэргэжил <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="profession"
          value={formData.profession}
          onChange={handleChange}
          required
          className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-white placeholder-white/50 backdrop-blur-sm"
          placeholder="Танай мэргэжил"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-white mb-3">
          Профайл зураг оруулах
        </label>
        <div className="border-2 border-dashed border-white/30 rounded-2xl p-8 text-center bg-white/5 backdrop-blur-sm">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-400/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            id="profileImage"
          />
          <label
            htmlFor="profileImage"
            className="cursor-pointer text-white/70 hover:text-white transition-colors"
          >
            <p className="text-sm mb-2">Зураг сонгох</p>
            <p className="text-xs text-white/50">PNG, JPG дээд тал нь 5MB</p>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-white mb-3">
          Танай тухай
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-white placeholder-white/50 backdrop-blur-sm resize-none"
          placeholder="Өөрийнхөө тухай товч танилцуулна уу..."
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Enhanced Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1706074740295-d7a79c079562?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="background"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/40 to-black/80" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-lg">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-4 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <svg
                  className="w-10 h-10 text-white"
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
              <h1 className="text-4xl font-bold text-white mb-2">
                Mentor Meet
              </h1>
              <p className="text-white/70">Профайл үүсэх боломж</p>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-between mb-10">
              {steps.map((step) => (
                <div key={step.id} className="flex-1">
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        currentStep >= step.id
                          ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg"
                          : "bg-white/20 text-white/50"
                      }`}
                    >
                      {currentStep > step.id ? "✓" : step.id}
                    </div>
                    {step.id < 3 && (
                      <div
                        className={`flex-1 h-1 mx-2 rounded transition-all ${
                          currentStep > step.id
                            ? "bg-gradient-to-r from-yellow-400 to-orange-400"
                            : "bg-white/20"
                        }`}
                      />
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-white/90">
                      {step.title}
                    </p>
                    <p className="text-xs text-white/50">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              {message && (
                <div
                  className={`mb-6 p-4 rounded-2xl text-center backdrop-blur-sm ${
                    message.includes("✅")
                      ? "bg-green-500/20 text-green-100 border border-green-500/30"
                      : "bg-red-500/20 text-red-100 border border-red-500/30"
                  }`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Dynamic Step Content */}
                <div className="min-h-[400px]">
                  {currentStep === 1 && renderStep1()}
                  {currentStep === 2 && renderStep2()}
                  {currentStep === 3 && renderStep3()}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-white/20">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                      currentStep === 1
                        ? "bg-white/10 text-white/50 cursor-not-allowed"
                        : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                    }`}
                  >
                    Буцах
                  </button>

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl font-semibold hover:from-yellow-500 hover:to-orange-500 transform hover:scale-105 transition-all shadow-lg"
                    >
                      Дараах
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl font-semibold hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition-all shadow-lg"
                    >
                      Үргэлжлүүлэх
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Side - Live Preview */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Таны мэдээлэл хэрхэн харагдах вэ?
            </h3>

            {/* Preview Card */}
            <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="text-center">
                {/* Profile Image Preview */}
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-2xl mx-auto mb-6 flex items-center justify-center border-2 border-white/20">
                  {formData.profileImage ? (
                    <img
                      src={URL.createObjectURL(formData.profileImage)}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <svg
                      className="w-12 h-12 text-white/50"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>

                {/* Name Display */}
                <h4 className="text-xl font-bold text-white mb-2">
                  {formData.showNickname && formData.nickname
                    ? formData.nickname
                    : formData.firstName || "Таны нэр"}{" "}
                  {formData.lastNameInitial && formData.lastNameInitial + "."}
                </h4>

                {/* Professional Info */}
                <p className="text-white/70 mb-2">
                  {formData.profession || "Мэргэжил"}
                </p>

                <p className="text-white/50 text-sm mb-4">
                  {formData.experience &&
                  formData.experience !== "Туршлага сонгох"
                    ? formData.experience + " туршлагатай"
                    : "Туршлага"}
                </p>

                {/* Bio Preview */}
                {formData.bio && (
                  <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <p className="text-white/80 text-sm leading-relaxed">
                      {formData.bio.length > 100
                        ? formData.bio.substring(0, 100) + "..."
                        : formData.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="bg-black/30 backdrop-blur-lg border-t border-white/10">
          <div className="max-w-6xl mx-auto px-8 py-4">
            <div className="flex justify-center space-x-12">
              <a
                href="#"
                className="text-white/70 hover:text-white transition-colors text-sm font-medium"
              >
                Нүүр хуудас
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-white transition-colors text-sm font-medium"
              >
                Менторууд
              </a>
              <a href="#" className="text-yellow-400 font-semibold text-sm">
                Бүртгүүлэх
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleProfileForm;
