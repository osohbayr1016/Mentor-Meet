import React from "react";
import { Step2Props } from "../types/FormTypes";
import {
  professionalFields,
  experienceOptions,
} from "../constants/FormConstants";

const Step2AdditionalDetails: React.FC<Step2Props> = ({
  formData,
  setFormData,
  onNext,
  onPrev,
  message,
  isLoading,
}) => {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="flex h-full">
      {/* Left Side - Form */}
      <div className="w-1/2 p-6 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
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
            {/* School Input */}
            <div>
              <label className="block text-white text-xs font-medium mb-1">
                Төгссөн сургууль
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60 text-xs"
                placeholder="Төгссөн сургуулийн нэрийг оруулна уу..."
              />
            </div>

            {/* Introduction/Bio */}
            <div>
              <label className="block text-white text-xs font-medium mb-1">
                Танилцуулга
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60 text-xs resize-none"
                placeholder="Өөрийгөө танилцуулна уу..."
              />
            </div>

            {/* Social Media Link */}
            <div>
              <label className="block text-white text-xs font-medium mb-1">
                Сошиал медиа холбоос
              </label>
              <input
                type="url"
                name="website"
                value={formData.socialLinks?.website || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    socialLinks: {
                      ...prev.socialLinks,
                      website: e.target.value,
                    },
                  }))
                }
                className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60 text-xs"
                placeholder="https://"
              />
            </div>

            {/* Add Link Button */}
            <div>
              <button
                type="button"
                className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-xl text-white text-xs hover:bg-black/30 transition-all"
              >
                Холбоос нэмэх
              </button>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onPrev}
                disabled={isLoading}
                className={`flex-1 py-2.5 rounded-xl font-medium transition-all text-xs ${
                  isLoading
                    ? "bg-gray-600/20 border border-gray-500/30 text-gray-400 cursor-not-allowed"
                    : "bg-black/20 hover:bg-black/30 text-white border border-white/30 hover:border-white/50"
                }`}
              >
                Буцах
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 py-2.5 rounded-xl font-medium transition-all text-xs ${
                  isLoading
                    ? "bg-gray-600/20 border border-gray-500/30 text-gray-400 cursor-not-allowed"
                    : "bg-white/20 hover:bg-white/30 text-white border border-white/40 hover:border-white/60"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                    Үргэлжлүүлж байна...
                  </div>
                ) : (
                  "Үргэлжлүүлэх"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Preview */}
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

          {/* Additional Details Preview */}
          <div className="space-y-4">
            {/* School */}
            <div className="bg-black/30 rounded-xl p-3 border border-white/30">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-black/40 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white/70"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                  </svg>
                </div>
                <span className="text-white/70 text-xs font-medium">
                  Сургууль
                </span>
              </div>
              <p className="text-white text-xs font-medium">
                {formData.specialization || "Сургуулийн нэр"}
              </p>
            </div>

            {/* Bio */}
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
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-white/70 text-xs font-medium">
                  Танилцуулга
                </span>
              </div>
              <p className="text-white text-xs">
                {formData.description || "Танилцуулга бичнэ үү..."}
              </p>
            </div>

            {/* Social Links */}
            <div className="bg-black/30 rounded-xl p-3 border border-white/30">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-black/40 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white/70"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                </div>
                <span className="text-white/70 text-xs font-medium">
                  Холбоосууд
                </span>
              </div>
              <p className="text-white text-xs">
                {formData.socialLinks?.website || "Холбоос нэмнэ үү..."}
              </p>
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

export default Step2AdditionalDetails;
