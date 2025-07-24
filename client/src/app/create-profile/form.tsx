"use client";

import { useState } from "react";
import Image from "next/image";

const SimpleProfileForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastNameInitial: "",
    professionalField: "",
    experience: "",
    profession: "",
    bio: "",
  });

  const [message, setMessage] = useState("");

  const professionalFields = [
    "Санхүү сэргээн үү",
    "Технологи",
    "Боловсрол",
    "Эрүүл мэнд",
    "Бизнес",
    "Инженер",
    "Дизайн",
    "Маркетинг",
  ];

  const experienceOptions = [
    "Жил",
    "1-2 жил",
    "3-5 жил",
    "5-10 жил",
    "10+ жил",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        setFormData({
          firstName: "",
          lastNameInitial: "",
          professionalField: "",
          experience: "",
          profession: "",
          bio: "",
        });
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
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="bg-white text-gray-800 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Mentor Meet
            </h1>
            <p className="text-gray-600 text-sm">Профайл үүсэх боломж</p>
          </div>

          {message && (
            <div
              className={`mb-6 p-3 rounded-lg text-center text-sm ${
                message.includes("✅")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Нэр
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Нэрээ оруулна уу"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Овгийн нэрийн эхний үсэг
              </label>
              <input
                type="text"
                name="lastNameInitial"
                value={formData.lastNameInitial}
                onChange={handleChange}
                required
                maxLength={1}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="ө.а, Б"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Мэргэжлийн салбар
              </label>
              <select
                name="professionalField"
                value={formData.professionalField}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="">Салбар сонгоно уу</option>
                {professionalFields.map((field, index) => (
                  <option key={index} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Туршлага
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="">Туршлага сонгоно уу</option>
                {experienceOptions.map((exp, index) => (
                  <option key={index} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Мэргэжил
              </label>
              <input
                type="text"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Мэргэжлээ оруулна уу"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Профайл тухай "оруулга"
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Өөрийнхөө тухай товч танилцуулна уу..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 px-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
            >
              Үргэлжлүүлэх
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SimpleProfileForm;
