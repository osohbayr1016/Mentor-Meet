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
              className="w-full bg-white/20 hover:bg-white/30 text-white py-2.5 rounded-xl font-medium transition-all border border-white/40 hover:border-white/60 text-xs"
            >
              Үргэлжлүүлэх
            </button>
          </div>
        </form>
      </div>

      {/* Right Side - Live Preview */}
      <div className="w-2/5 p-5 border-l border-white/20">
        <div className="h-full flex flex-col">
          <h3 className="text-white text-sm font-medium mb-4 text-center">
            Таны мэдээлэл хэрхэн харагдах вэ?
          </h3>

          {/* Preview Card */}
          <div className="backdrop-blur-xl rounded-2xl p-4 border border-white/20 flex-1">
            <div className="text-center h-full flex flex-col justify-center">
              {/* Profile Image Preview */}
              <div className="w-12 h-12 bg-black/30 rounded-xl mx-auto mb-3 flex items-center justify-center border border-white/20">
                {formData.profileImage ? (
                  <img
                    src={URL.createObjectURL(formData.profileImage)}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <svg
                    className="w-6 h-6 text-white/60"
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

              {/* Profession Display */}
              <div className="text-white/70 text-xs mb-2">
                {formData.profession || "Мэргэжил"}
              </div>

              {/* Professional Field */}
              {formData.professionalField && (
                <div className="text-white/60 text-xs mb-2">
                  {
                    professionalFields.find(
                      (field) => field.value === formData.professionalField
                    )?.label
                  }
                </div>
              )}

              {/* Profile Info Card */}
              <div className="bg-black/20 rounded-lg p-2.5 mb-2 border border-white/10">
                <svg
                  className="w-5 h-5 text-white/40 mx-auto mb-1"
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
                  <p className="text-white/70 text-xs leading-relaxed">
                    {formData.bio.length > 30
                      ? formData.bio.substring(0, 30) + "..."
                      : formData.bio}
                  </p>
                )}
              </div>

              {/* Experience Display */}
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

              {/* Additional Info Dots */}
              {!formData.firstName &&
                !formData.profession &&
                !formData.experience && (
                  <div className="text-white/40 text-xs space-y-1 mt-2">
                    <div>...</div>
                    <div>...</div>
                  </div>
                )}
            </div>
          </div>

          {/* Form Completion Progress */}
          <div className="mt-3 text-center">
            <div className="text-white/50 text-xs mb-1">Форм бөглөх явц</div>
            <div className="w-full bg-white/20 rounded-full h-0.5">
              <div
                className="bg-white h-0.5 rounded-full transition-all duration-500"
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
  );
};

export default Step1BasicInfo;
