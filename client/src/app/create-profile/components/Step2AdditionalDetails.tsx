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
      <div className="w-3/5 p-5">
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
          {/* Specialization */}
          <div>
            <label className="block text-white text-xs font-medium mb-1">
              Тусгай зэрэг/Мэргэшил
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60 text-xs"
              placeholder="Тусгай чиглэлүүдээ хуваах оруулна уу..."
            />
          </div>

          {/* Description/Bio */}
          <div>
            <label className="block text-white text-xs font-medium mb-1">
              Тэмдэгтэт зураг
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60 text-xs resize-none"
              placeholder="Өөрийн зов чавга зорьжжуулах у..."
            />
          </div>

          {/* Social Links */}
          <div>
            <label className="block text-white text-xs font-medium mb-1">
              Сонгон нэвэр хэлбэсэх
            </label>
            <div className="relative">
              <select
                name="socialPlatform"
                className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white appearance-none cursor-pointer text-xs"
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

          {/* Website/Link */}
          <div>
            <label className="block text-white text-xs font-medium mb-1">
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
              className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60 text-xs"
              placeholder="https://"
            />
          </div>

          {/* Connection Links */}
          <div>
            <label className="block text-white text-xs font-medium mb-1">
              Холбоос зэрэг
            </label>
            <input
              type="text"
              name="connectionLinks"
              className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60 text-xs"
              placeholder="Бусад холбоосууд..."
            />
          </div>

          {/* Large Text Area */}
          <div>
            <textarea
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60 text-xs resize-none"
              placeholder="Амжилт, туршлага, онцлог шинж чанаруудаа дэлгэрэнгүй бичнэ үү..."
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onPrev}
              className="flex-1 bg-black/20 hover:bg-black/30 text-white py-2.5 rounded-xl font-medium transition-all border border-white/30 hover:border-white/50 text-xs"
            >
              Буцах
            </button>
            <button
              type="submit"
              className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2.5 rounded-xl font-medium transition-all border border-white/40 hover:border-white/60 text-xs"
            >
              Үргэлжлүүлэх
            </button>
          </div>
        </form>
      </div>

      {/* Right Side - Enhanced Preview */}
      <div className="w-2/5 p-5 border-l border-white/20">
        <div className="h-full flex flex-col">
          <h3 className="text-white text-sm font-medium mb-4 text-center">
            Таны профайл
          </h3>

          {/* Enhanced Preview Card */}
          <div className="backdrop-blur-xl rounded-2xl p-4 border border-white/20 flex-1">
            <div className="text-center h-full flex flex-col">
              {/* Profile Image Preview */}
              <div className="w-16 h-16 bg-black/30 rounded-xl mx-auto mb-3 flex items-center justify-center border border-white/20">
                {formData.profileImage ? (
                  <img
                    src={URL.createObjectURL(formData.profileImage)}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <svg
                    className="w-8 h-8 text-white/60"
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

              {/* Name and Title */}
              <div className="text-white/90 text-sm font-medium mb-1">
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

              <div className="text-white/70 text-xs mb-2">
                {formData.profession || "Мэргэжил"}
              </div>

              {/* Specialization */}
              {formData.specialization && (
                <div className="text-white/60 text-xs mb-2">
                  {formData.specialization}
                </div>
              )}

              {/* Description Preview */}
              {formData.description && (
                <div className="bg-black/20 rounded-lg p-2.5 mb-2 border border-white/10">
                  <p className="text-white/70 text-xs leading-relaxed">
                    {formData.description.length > 50
                      ? formData.description.substring(0, 50) + "..."
                      : formData.description}
                  </p>
                </div>
              )}

              {/* Social Links Preview */}
              {formData.socialLinks.website && (
                <div className="flex items-center justify-center gap-1 text-white/60 text-xs mb-2">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-blue-400">Вэбсайт</span>
                </div>
              )}

              {/* Experience */}
              <div className="flex items-center justify-center gap-1 text-white/60 text-xs">
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
            </div>
          </div>

          {/* Form Completion Progress */}
          <div className="mt-3 text-center">
            <div className="text-white/50 text-xs mb-1">
              Профайл бүрэн үүсэх
            </div>
            <div className="w-full bg-white/20 rounded-full h-0.5">
              <div
                className="bg-white h-0.5 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    (((formData.firstName ? 1 : 0) +
                      (formData.profession ? 1 : 0) +
                      (formData.description ? 1 : 0) +
                      (formData.specialization ? 1 : 0) +
                      (formData.socialLinks.website ? 1 : 0) +
                      (formData.achievements ? 1 : 0)) /
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
  );
};

export default Step2AdditionalDetails;
