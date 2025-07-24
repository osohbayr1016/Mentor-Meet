import React from "react";
import { Step3Props } from "../types/FormTypes";
import { bankOptions } from "../constants/FormConstants";

const Step3PaymentInfo: React.FC<Step3Props> = ({
  formData,
  setFormData,
  onPrev,
  onSubmit,
  message,
  isLoading,
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
    <div className="h-full p-6 flex flex-col justify-center">
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

        {/* Title */}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hourly Rate */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Та өөрийн 1 цагийн үнэлгээ бичнэ үү:
            </label>
            <input
              type="text"
              name="yearExperience"
              value={formData.yearExperience}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60 text-sm"
              placeholder="MNT₮"
            />
          </div>

          {/* Bank Information - Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Дансны дугаар
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.bankAccount.accountNumber}
                onChange={handleBankChange}
                required
                className="w-full px-4 py-3 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60 text-sm"
                placeholder="Дансны дугаар"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Банк
              </label>
              <div className="relative">
                <select
                  name="bankName"
                  value={formData.bankAccount.bankName}
                  onChange={handleBankChange}
                  required
                  className="w-full px-4 py-3 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white appearance-none cursor-pointer text-sm"
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
          </div>

          {/* Account Name */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Хүлээн авагчийн нэр
            </label>
            <input
              type="text"
              name="accountName"
              value={formData.bankAccount.accountName}
              onChange={handleBankChange}
              required
              className="w-full px-4 py-3 bg-black/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/60 text-sm"
              placeholder="Хүлээн авагчийн нэр"
            />
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agreement"
              required
              className="mt-1 w-4 h-4 bg-black/20 border border-white/30 rounded focus:ring-2 focus:ring-white/50"
            />
            <label
              htmlFor="agreement"
              className="text-white/80 text-sm leading-relaxed"
            >
              Таны утасны дугаар бусдад харагдахгүй ба зөвхөн мэдээлэл хүргэх
              зорилготой болно.
            </label>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-6">
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
                  Бүртгэж байна...
                </div>
              ) : (
                "Үргэлжлүүлэх"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step3PaymentInfo;
