"use client";

import { useState } from "react";
import Image from "next/image";

const SimpleProfileForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastNameInitial: "",
    nickname: "",
    showNickname: false,
    professionalField: "",
    experience: "",
    profession: "",
    bio: "",
    profileImage: null as File | null,
  });

  const [message, setMessage] = useState("");

  const professionalFields = [
    { value: "", label: "Салбар сонгоно уу" },
    { value: "technology", label: "Технологи" },
    { value: "education", label: "Боловсрол" },
    { value: "healthcare", label: "Эрүүл мэнд" },
    { value: "business", label: "Бизнес" },
    { value: "engineering", label: "Инженерчлэл" },
    { value: "design", label: "Дизайн" },
    { value: "marketing", label: "Маркетинг" },
    { value: "finance", label: "Санхүү" },
  ];

  const experienceOptions = [
    { value: "", label: "Жил" },
    { value: "1-2", label: "1-2 жил" },
    { value: "3-5", label: "3-5 жил" },
    { value: "5-10", label: "5-10 жил" },
    { value: "10+", label: "10+ жил" },
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
<<<<<<< HEAD
      <div className="relative z-10 flex items-center justify-center min-h-screen px-8 py-12">
        <div className="w-full max-w-5xl backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/10">
          {/* Header */}
          <div className="text-center py-8 px-8 border-b border-white/20">
            {/* Logo and Title */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-gray-800"
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
              <h1 className="font-bold text-[22px] text-white">Mentor Meet</h1>
            </div>

            {/* Subtext */}
            <h2 className="text-white text-xl mb-6 font-medium">
              Профайл үүсэж байна...
            </h2>

            {/* Step Progress Bar */}
            <div className="flex justify-center items-center gap-2">
              <div className="h-1 w-12 rounded-full bg-white"></div>
              <div className="h-1 w-12 rounded-full bg-white"></div>
              <div className="h-1 w-12 rounded-full bg-gray-500"></div>
            </div>
=======
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-6xl backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/10">
          {/* Header */}
          <div className="text-center py-8 border-b border-white/20">
            <div className="bg-gray-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
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
            <h1 className="text-2xl font-bold text-white mb-2">Mentor Meet</h1>
            <p className="text-gray-300">Профайл үүсэх боломж...</p>
>>>>>>> 90c7f30566d6ed025bc770277760fb4622ec96f2
          </div>

          {/* Main Form Area */}
          <div className="flex">
            {/* Left Side - Form */}
            <div className="flex-1 p-8">
              {message && (
                <div
                  className={`mb-6 p-4 rounded-xl text-center ${
                    message.includes("✅")
                      ? "bg-green-600/20 text-green-100 border border-green-500/30"
                      : "bg-red-600/20 text-red-100 border border-red-500/30"
                  }`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name and Initial Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Нэр
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black/20 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60"
                      placeholder="Нэрээ оруулна уу"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Овгийн эхний үсэг
                    </label>
                    <input
                      type="text"
                      name="lastNameInitial"
                      value={formData.lastNameInitial}
                      onChange={handleChange}
                      required
                      maxLength={1}
                      className="w-full px-4 py-3 bg-black/20 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60"
                      placeholder="ө.а, А"
                    />
                  </div>
                </div>

                {/* Nickname with Toggle */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Дуудаж нэр (заавал биш)
                  </label>
<<<<<<< HEAD
                  <div className="flex gap-3">
=======
                  <div className="flex space-x-3">
>>>>>>> 90c7f30566d6ed025bc770277760fb4622ec96f2
                    <input
                      type="text"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleChange}
<<<<<<< HEAD
                      className="flex-1 px-4 py-3 bg-black/20 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60"
=======
                      className="flex-1 px-4 py-3  border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-white placeholder-gray-400"
>>>>>>> 90c7f30566d6ed025bc770277760fb4622ec96f2
                      placeholder="ө.а, Twissu"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          showNickname: !prev.showNickname,
                        }))
                      }
                      className={`px-6 py-3 rounded-2xl font-medium transition-all border ${
                        formData.showNickname
                          ? "bg-white/20 text-white border-white/50"
                          : "bg-black/20 text-white/80 border-white/30 hover:bg-white/10"
                      }`}
                    >
                      Харуулах
                    </button>
                  </div>
                </div>

                {/* Professional Field and Experience Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Мэргэжлийн салбар
                    </label>
                    <div className="relative">
                      <select
                        name="professionalField"
                        value={formData.professionalField}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-black/20 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white appearance-none cursor-pointer"
                      >
                        {professionalFields.map((field) => (
                          <option
                            key={field.value}
                            value={field.value}
                            className="bg-gray-800 text-white"
                          >
                            {field.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-white/60"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Туршлага
                    </label>
                    <div className="relative">
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-black/20 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white appearance-none cursor-pointer"
                      >
                        {experienceOptions.map((exp) => (
                          <option
                            key={exp.value}
                            value={exp.value}
                            className="bg-gray-800 text-white"
                          >
                            {exp.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-white/60"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profession */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Мэргэжил
                  </label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/20 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60"
                    placeholder="Мэргэжлээ оруулна уу"
                  />
                </div>

                {/* Profile Image Upload */}
                <div>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                      id="profileImage"
                    />
                    <label
                      htmlFor="profileImage"
                      className="w-full px-4 py-3 bg-black/20 border border-white/30 rounded-2xl transition-all text-white/80 cursor-pointer hover:bg-black/30 flex items-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="flex-1">
                        {formData.profileImage
                          ? formData.profileImage.name
                          : "Профайл зураг оруулах 📷"}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-white/20 hover:bg-white/30 text-white py-4 rounded-2xl font-medium transition-all border border-white/40 hover:border-white/60"
                  >
                    Үргэлжлүүлэх
                  </button>
                </div>
              </form>
            </div>

            {/* Right Side - Live Preview */}
            <div className="flex-1 p-8 border-l border-white/20">
              <div className="sticky top-8">
                <h3 className="text-white text-lg font-medium mb-8 text-center">
                  Таны мэдээлэл хэрхэн харагдах вэ?
                </h3>

                {/* Preview Card */}
                <div className="backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                  <div className="text-center">
                    {/* Profile Image Preview */}
                    <div className="w-20 h-20 bg-black/30 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-white/20">
                      {formData.profileImage ? (
                        <img
                          src={URL.createObjectURL(formData.profileImage)}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        <svg
                          className="w-10 h-10 text-white/60"
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

                    {/* Dynamic Name Display */}
                    <div className="text-white/90 text-lg font-medium mb-2">
                      {formData.showNickname && formData.nickname ? (
                        <>
                          {formData.nickname}
                          {formData.lastNameInitial &&
                            ` ${formData.lastNameInitial}.`}
                        </>
                      ) : (
                        <>
                          {formData.firstName || "Нэр"}
                          {formData.lastNameInitial &&
                            ` ${formData.lastNameInitial}.`}
                        </>
                      )}
                    </div>

                    {/* Profession Display */}
                    <div className="text-white/70 text-sm mb-4">
                      {formData.profession || "Мэргэжил"}
                    </div>

                    {/* Professional Field */}
                    {formData.professionalField && (
                      <div className="text-white/60 text-xs mb-3">
                        {
                          professionalFields.find(
                            (field) =>
                              field.value === formData.professionalField
                          )?.label
                        }
                      </div>
                    )}

                    {/* Profile Info Card */}
                    <div className="bg-black/20 rounded-xl p-4 mb-4 border border-white/10">
                      <svg
                        className="w-8 h-8 text-white/40 mx-auto mb-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>

                      {/* Bio Preview */}
                      {formData.bio && (
                        <p className="text-white/70 text-xs leading-relaxed mt-2">
                          {formData.bio.length > 50
                            ? formData.bio.substring(0, 50) + "..."
                            : formData.bio}
                        </p>
                      )}
                    </div>

                    {/* Experience Display */}
                    <div className="flex items-center justify-center gap-2 text-white/60 text-xs">
                      <span>Туршлага:</span>
                      <span className="text-white/80">
                        {formData.experience
                          ? experienceOptions.find(
                              (exp) => exp.value === formData.experience
                            )?.label
                          : "..."}
                      </span>
                      {formData.experience && (
                        <span className="text-yellow-400">⭐</span>
                      )}
                    </div>

                    {/* Additional Info Dots */}
                    {!formData.firstName &&
                      !formData.profession &&
                      !formData.experience && (
                        <div className="text-white/40 text-xs space-y-2">
                          <div>...</div>
                          <div>...</div>
                        </div>
                      )}
                  </div>
                </div>

                {/* Form Completion Progress */}
                <div className="mt-6 text-center">
                  <div className="text-white/50 text-xs mb-2">
                    Форм бөглөх явц
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1">
                    <div
                      className="bg-white h-1 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (((formData.firstName ? 1 : 0) +
                            (formData.lastNameInitial ? 1 : 0) +
                            (formData.professionalField ? 1 : 0) +
                            (formData.experience ? 1 : 0) +
                            (formData.profession ? 1 : 0) +
                            (formData.profileImage ? 1 : 0)) /
                            6) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="backdrop-blur-2xl border-t border-white/10">
          <div className="max-w-6xl mx-auto px-8 py-6">
            <div className="flex justify-center space-x-8">
              <button className="px-8 py-3 text-white/70 hover:text-white transition-colors rounded-2xl backdrop-blur-sm border border-white/20 hover:border-white/40">
                Нүүр хуудас
              </button>
              <button className="px-8 py-3 text-white/70 hover:text-white transition-colors rounded-2xl backdrop-blur-sm border border-white/20 hover:border-white/40">
                Менторууд
              </button>
              <button className="px-8 py-3 bg-white/20 text-white font-medium rounded-2xl backdrop-blur-sm border border-white/50 hover:border-white/70">
                Бүртгүүлэх
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="absolute bottom-4 left-8 text-xs text-white/60 z-20">
        <div>Copyright © 2025 Mentor Meet</div>
        <div>All rights reserved.</div>
      </div>
    </div>
  );
};

export default SimpleProfileForm;
