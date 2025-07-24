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
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-6xl bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="text-center py-8 border-b border-gray-700/50">
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

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
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
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-white placeholder-gray-400"
                    placeholder="Нэрээ оруулна уу"
                  />
                </div>

                {/* Last Name Initial */}
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
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-white placeholder-gray-400"
                    placeholder="ө.а, А"
                  />
                </div>

                {/* Nickname with Toggle */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Дуудаж нэр (заавал биш)
                  </label>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-white placeholder-gray-400"
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
                      className={`px-6 py-3 rounded-full font-medium transition-all ${
                        formData.showNickname
                          ? "bg-blue-600 text-white"
                          : "bg-gray-600 text-gray-300"
                      }`}
                    >
                      Харуулах
                    </button>
                  </div>
                </div>

                {/* Professional Field and Experience - Row */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Мэргэжлийн салбар
                    </label>
                    <select
                      name="professionalField"
                      value={formData.professionalField}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-white appearance-none"
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
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Туршлага
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-white appearance-none"
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
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-white placeholder-gray-400"
                    placeholder="Мэргэжлээ оруулна уу"
                  />
                </div>

                {/* Profile Image Upload */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Профайл зураг оруулах 📷
                  </label>
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
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-full focus:outline-none transition-all text-gray-400 cursor-pointer hover:bg-gray-600/50 flex items-center"
                    >
                      <span className="flex-1">
                        {formData.profileImage
                          ? formData.profileImage.name
                          : "Зураг сонгох..."}
                      </span>
                      <svg
                        className="w-5 h-5 ml-2"
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
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gray-600 hover:bg-gray-500 text-white py-4 rounded-full font-medium transition-colors"
                >
                  Үргэлжлүүлэх
                </button>
              </form>
            </div>

            {/* Right Side - Live Preview */}
            <div className="flex-1 p-8 border-l border-gray-700/50">
              <div className="sticky top-8">
                <h3 className="text-white text-lg font-medium mb-6 text-center">
                  Таны мэдээлэл хэрхэн харагдах вэ?
                </h3>

                {/* Preview Card */}
                <div className="bg-gray-700/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-600/30">
                  <div className="text-center">
                    {/* Profile Image Preview */}
                    <div className="w-20 h-20 bg-gray-600 rounded-2xl mx-auto mb-6 flex items-center justify-center border-2 border-gray-500">
                      {formData.profileImage ? (
                        <img
                          src={URL.createObjectURL(formData.profileImage)}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        <svg
                          className="w-10 h-10 text-gray-400"
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
                    <div className="text-white mb-4">
                      <div className="text-xs text-gray-400 mb-1">...</div>
                      <div className="text-xs text-gray-400 mb-3">...</div>

                      <div className="bg-gray-600/50 rounded-xl p-4 mb-4">
                        <svg
                          className="w-8 h-8 text-gray-400 mx-auto mb-2"
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

                      <div className="text-xs text-gray-400 mb-1">
                        Туршлага:
                      </div>
                      <div className="text-xs text-gray-400">...</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="bg-black/60 backdrop-blur-lg">
          <div className="max-w-6xl mx-auto px-8 py-4">
            <div className="flex justify-center space-x-12">
              <button className="px-8 py-3 text-gray-400 hover:text-white transition-colors rounded-full bg-gray-800/50">
                Нүүр хуудас
              </button>
              <button className="px-8 py-3 text-gray-400 hover:text-white transition-colors rounded-full bg-gray-800/50">
                Менторууд
              </button>
              <button className="px-8 py-3 bg-gray-600 text-white font-medium rounded-full">
                Бүртгүүлэх
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="absolute bottom-4 left-8 text-xs text-gray-500 z-20">
        <div>Copyright © 2025 Mentor Meet</div>
        <div>All rights reserved.</div>
      </div>
    </div>
  );
};

export default SimpleProfileForm;
