import React from "react";
import { Step1Props } from "../types/FormTypes";
import {
  professionalFields,
  experienceOptions,
} from "../constants/FormConstants";

const Step1BasicInfo: React.FC<Step1Props> = ({
  formData,
  setFormData,
  onNext,
  message,
  isLoading,
}) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="flex h-full">
      {/* Left Side - Form */}
      <div className="w-1/2 p-6 flex flex-col justify-center">
        {message && (
          <div
            className={`mb-3 p-2.5 rounded-xl text-center text-xs ${
              message.includes("✅")
                ? "bg-green-600/20 text-green-100 border border-green-500/30"
                : "bg-red-600/20 text-red-100 border border-red-500/30"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name and Initial Row */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-white text-xs font-medium mb-1">
                Нэр
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60 text-xs"
                placeholder="Нэрээ оруулна уу"
              />
            </div>

            <div>
              <label className="block text-white text-xs font-medium mb-1">
                Овгийн эхний үсэг
              </label>
              <input
                type="text"
                name="lastNameInitial"
                value={formData.lastNameInitial}
                onChange={handleChange}
                required
                maxLength={1}
                className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60 text-xs"
                placeholder="ө.а, А"
              />
            </div>
          </div>

          {/* Nickname with Toggle */}
          <div>
            <label className="block text-white text-xs font-medium mb-1">
              Дуудаж нэр (заавал биш)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="flex-1 px-3 py-2 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60 text-xs"
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
                className={`px-3 py-2 rounded-xl font-medium transition-all border text-xs ${
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
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-white text-xs font-medium mb-1">
                Мэргэжлийн салбар
              </label>
              <div className="relative">
                <select
                  name="professionalField"
                  value={formData.professionalField}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white appearance-none cursor-pointer text-xs"
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
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                  <svg
                    className="w-3.5 h-3.5 text-white/60"
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
              <label className="block text-white text-xs font-medium mb-1">
                Туршлага
              </label>
              <div className="relative">
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white appearance-none cursor-pointer text-xs"
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
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                  <svg
                    className="w-3.5 h-3.5 text-white/60"
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
            <label className="block text-white text-xs font-medium mb-1">
              Мэргэжил
            </label>
            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60 text-xs"
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
                className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-xl transition-all text-white/80 cursor-pointer hover:bg-black/30 flex items-center gap-2 text-xs"
              >
                <svg
                  className="w-3.5 h-3.5"
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
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 rounded-xl font-medium transition-all text-xs ${
                isLoading
                  ? "bg-gray-600/20 border border-gray-500/30 text-gray-400 cursor-not-allowed"
                  : "bg-white/20 hover:bg-white/30 text-white border border-white/40 hover:border-white/60"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                  Шалгаж байна...
                </div>
              ) : (
                "Үргэлжлүүлэх"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Right Side - Professional Preview */}
      <div className="w-1/2 p-6">
        <div className="h-full backdrop-blur-xl bg-black/20 rounded-2xl border border-white/30 p-6 transform transition-all duration-300 hover:border-white/50">
          {/* Profile Header */}
          <div className="text-center mb-6">
            {/* Profile Image with Status */}
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/30 transition-all duration-300 hover:border-white/50">
                {formData.profileImage ? (
                  <img
                    src={URL.createObjectURL(formData.profileImage)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-black/30 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-white/60"
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
                )}
              </div>
              {/* Online Status */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-black/20 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Name and Title */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white leading-tight">
                {formData.showNickname && formData.nickname ? (
                  <>
                    {formData.nickname}
                    {formData.lastNameInitial && (
                      <span className="text-white/70">
                        {" "}
                        {formData.lastNameInitial}.
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    {formData.firstName || (
                      <span className="text-white/50">Таны нэр</span>
                    )}
                    {formData.lastNameInitial && (
                      <span className="text-white/70">
                        {" "}
                        {formData.lastNameInitial}.
                      </span>
                    )}
                  </>
                )}
              </h2>

              <div className="flex items-center justify-center gap-2">
                <div className="h-px bg-white/30 flex-1"></div>
                <span className="text-white/70 text-sm px-2">
                  {formData.profession || "Мэргэжил"}
                </span>
                <div className="h-px bg-white/30 flex-1"></div>
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div className="space-y-4">
            {/* Field & Experience */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/30 rounded-xl p-3 border border-white/30">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-black/40 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white/70"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                    </svg>
                  </div>
                  <span className="text-white/70 text-xs font-medium">
                    Салбар
                  </span>
                </div>
                <p className="text-white text-xs font-medium">
                  {formData.professionalField
                    ? professionalFields.find(
                        (f) => f.value === formData.professionalField
                      )?.label
                    : "Салбар сонгоно уу"}
                </p>
              </div>

              <div className="bg-black/30 rounded-xl p-3 border border-white/30">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-black/40 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white/70"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-white/70 text-xs font-medium">
                    Туршлага
                  </span>
                </div>
                <p className="text-white text-xs font-medium">
                  {formData.experience
                    ? experienceOptions.find(
                        (e) => e.value === formData.experience
                      )?.label
                    : "Туршлага сонгоно уу"}
                </p>
              </div>
            </div>

            {/* Rating & Stats */}
            <div className="bg-black/30 rounded-xl p-3 border border-white/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-3 h-3 ${
                          i < 4 ? "text-yellow-400" : "text-white/30"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.02 3.14a1 1 0 00.95.69h3.3c.969 0 1.371 1.24.588 1.81l-2.674 1.944a1 1 0 00-.364 1.118l1.02 3.14c.3.921-.755 1.688-1.54 1.118l-2.674-1.944a1 1 0 00-1.176 0l-2.674 1.944c-.784.57-1.838-.197-1.539-1.118l1.02-3.14a1 1 0 00-.364-1.118L2.49 8.567c-.783-.57-.38-1.81.588-1.81h3.3a1 1 0 00.951-.69l1.02-3.14z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-white text-xs font-medium">
                    {formData.experience
                      ? {
                          "1-2": "4.2",
                          "3-5": "4.6",
                          "5-10": "4.8",
                          "10+": "4.9",
                        }[formData.experience] || "4.0"
                      : "4.0"}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-xs">Sessions</p>
                  <p className="text-white text-xs font-medium">
                    {formData.experience
                      ? {
                          "1-2": "25+",
                          "3-5": "100+",
                          "5-10": "500+",
                          "10+": "1000+",
                        }[formData.experience] || "0"
                      : "0"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="flex-1 bg-black/30 hover:bg-black/40 text-white py-2 px-3 rounded-xl font-medium transition-all duration-200 border border-white/30 hover:border-white/50">
                <div className="flex items-center justify-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                  </svg>
                  <span className="text-xs">Book Session</span>
                </div>
              </button>
              <button className="bg-black/30 hover:bg-black/40 text-white py-2 px-3 rounded-xl font-medium transition-all duration-200 border border-white/30 hover:border-white/50">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1BasicInfo;
