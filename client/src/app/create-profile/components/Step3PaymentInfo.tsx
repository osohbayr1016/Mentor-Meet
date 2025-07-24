import React from "react";
import { Step3Props } from "../types/FormTypes";
import { bankOptions, yearExperiences } from "../constants/FormConstants";

const Step3PaymentInfo: React.FC<Step3Props> = ({
  formData,
  setFormData,
  onPrev,
  onSubmit,
  message,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      bankAccount: { ...prev.bankAccount, [name]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
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
          {/* Title */}
          <div className="text-center mb-4">
            <h3 className="text-white text-sm font-medium">
              Та өөрийн төлбөрийн үнэлгээ хийх болно уу?
            </h3>
          </div>

          {/* Year Experience */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 text-white text-xs">
              <span>1 цаг =</span>
              <div className="relative">
                <select
                  name="yearExperience"
                  value={formData.yearExperience}
                  onChange={handleChange}
                  required
                  className="px-6 py-1 bg-black/20 border border-white/30 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white appearance-none cursor-pointer text-xs min-w-[80px]"
                >
                  {yearExperiences.map((year) => (
                    <option
                      key={year.value}
                      value={year.value}
                      className="bg-gray-800 text-white"
                    >
                      {year.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Bank Selection */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-white text-xs font-medium mb-1">
                Дансны дугаар
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.bankAccount.accountNumber}
                onChange={handleBankChange}
                required
                className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60 text-xs"
                placeholder="Дансны дугаараа оруулна уу"
              />
            </div>

            <div>
              <label className="block text-white text-xs font-medium mb-1">
                Банк
              </label>
              <div className="relative">
                <select
                  name="bankName"
                  value={formData.bankAccount.bankName}
                  onChange={handleBankChange}
                  required
                  className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white appearance-none cursor-pointer text-xs"
                >
                  {bankOptions.map((bank) => (
                    <option
                      key={bank.value}
                      value={bank.value}
                      className="bg-gray-800 text-white"
                    >
                      {bank.label}
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

          {/* Account Name */}
          <div>
            <label className="block text-white text-xs font-medium mb-1">
              Хүлээн авагчийн нэр
            </label>
            <input
              type="text"
              name="accountName"
              value={formData.bankAccount.accountName}
              onChange={handleBankChange}
              required
              className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60 text-xs"
              placeholder="Данс эзэмшигчийн нэр"
            />
          </div>

          {/* Warning Note */}
          <div className="flex items-start gap-2 p-3 bg-yellow-600/20 border border-yellow-500/30 rounded-xl">
            <svg
              className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-yellow-100 text-xs leading-relaxed">
              <p className="font-medium mb-1">Анхаар!</p>
              <p>
                Таны оруулсан дансны мэдээлэл буруу эсвэл байхгүй бол төлбөр
                хийх боломжгүй болохыг анхаарна уу.
              </p>
            </div>
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

      {/* Right Side - Final Preview */}
      <div className="w-2/5 p-5 border-l border-white/20">
        <div className="h-full flex flex-col">
          <h3 className="text-white text-sm font-medium mb-4 text-center">
            Төлбөрийн мэдээлэл
          </h3>

          {/* Payment Preview Card */}
          <div className="backdrop-blur-xl rounded-2xl p-4 border border-white/20 flex-1">
            <div className="text-center h-full flex flex-col justify-center">
              {/* Profile Summary */}
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

              <div className="text-white/70 text-xs mb-4">
                {formData.profession || "Мэргэжил"}
              </div>

              {/* Payment Info */}
              {formData.yearExperience && (
                <div className="bg-black/20 rounded-lg p-3 mb-3 border border-white/10">
                  <div className="flex items-center justify-center gap-2 text-white/80 text-xs mb-2">
                    <svg
                      className="w-4 h-4 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      1 цаг ={" "}
                      {
                        yearExperiences.find(
                          (y) => y.value === formData.yearExperience
                        )?.label
                      }
                    </span>
                  </div>
                </div>
              )}

              {/* Bank Info */}
              {formData.bankAccount.bankName && (
                <div className="bg-black/20 rounded-lg p-3 border border-white/10">
                  <div className="text-white/60 text-xs mb-1">Банк:</div>
                  <div className="text-white/80 text-xs mb-2">
                    {
                      bankOptions.find(
                        (b) => b.value === formData.bankAccount.bankName
                      )?.label
                    }
                  </div>

                  {formData.bankAccount.accountNumber && (
                    <>
                      <div className="text-white/60 text-xs mb-1">Данс:</div>
                      <div className="text-white/80 text-xs font-mono">
                        {formData.bankAccount.accountNumber
                          .replace(/(.{4})/g, "$1 ")
                          .trim()}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Completion Status */}
              <div className="mt-4 text-center">
                <div className="text-green-400 text-xs font-medium">
                  ✓ Бүртгэл бэлэн болов
                </div>
              </div>
            </div>
          </div>

          {/* Final Progress */}
          <div className="mt-3 text-center">
            <div className="text-white/50 text-xs mb-1">Бүртгэлийн явц</div>
            <div className="w-full bg-white/20 rounded-full h-0.5">
              <div className="bg-green-400 h-0.5 rounded-full transition-all duration-500 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3PaymentInfo;
