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
    <div className="min-h-full p-6">
      {message && (
        <div
          className={`mb-4 p-3 rounded-xl text-center text-sm ${
            message.includes("✅")
              ? "bg-green-600/20 text-green-100 border border-green-500/30"
              : "bg-red-600/20 text-red-100 border border-red-500/30"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
        {/* Specialization */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Тусгай зэрэг/Мэргэшил
          </label>
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60 text-sm"
            placeholder="Тусгай чиглэлүүдээ хуваах оруулна уу..."
          />
        </div>

        {/* Description/Bio */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Тэмдэгтэт зураг
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60 text-sm resize-none"
            placeholder="Өөрийн зов чавга зорьжжуулах у..."
          />
        </div>

        {/* Social Links */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Сонгон нэвэр хэлбэсэх
          </label>
          <div className="relative">
            <select
              name="socialPlatform"
              className="w-full px-4 py-3 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white appearance-none cursor-pointer text-sm"
            >
              <option value="" className="bg-gray-800 text-white">
                Платформ сонгоно уу
              </option>
              <option value="linkedin" className="bg-gray-800 text-white">
                LinkedIn
              </option>
              <option value="github" className="bg-gray-800 text-white">
                GitHub
              </option>
              <option value="twitter" className="bg-gray-800 text-white">
                Twitter
              </option>
              <option value="website" className="bg-gray-800 text-white">
                Website
              </option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
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

        {/* Website/Link */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Холбоос
          </label>
          <input
            type="url"
            name="website"
            value={formData.socialLinks.website}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, website: e.target.value },
              }))
            }
            className="w-full px-4 py-3 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60 text-sm"
            placeholder="https://"
          />
        </div>

        {/* Connection Links */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Холбоос зэрэг
          </label>
          <input
            type="text"
            name="connectionLinks"
            className="w-full px-4 py-3 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60 text-sm"
            placeholder="Бусад холбоосууд..."
          />
        </div>

        {/* Large Text Area */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Амжилт, туршлага
          </label>
          <textarea
            name="achievements"
            value={formData.achievements}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-3 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60 text-sm resize-none"
            placeholder="Амжилт, туршлага, онцлог шинж чанаруудаа дэлгэрэнгүй бичнэ үү..."
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={onPrev}
            disabled={isLoading}
            className={`flex-1 py-3 rounded-xl font-medium transition-all text-sm ${
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
            className={`flex-1 py-3 rounded-xl font-medium transition-all text-sm ${
              isLoading
                ? "bg-gray-600/20 border border-gray-500/30 text-gray-400 cursor-not-allowed"
                : "bg-white/20 hover:bg-white/30 text-white border border-white/40 hover:border-white/60"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin"></div>
                Үргэлжлүүлж байна...
              </div>
            ) : (
              "Үргэлжлүүлэх"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2AdditionalDetails;
