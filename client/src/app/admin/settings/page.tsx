"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Save,
  RefreshCw,
  Bell,
  Shield,
  Globe,
  CreditCard,
  Mail,
  Database,
  Users,
  Lock,
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Upload,
  Download,
} from "lucide-react";

interface SettingsData {
  general: {
    siteName: string;
    siteDescription: string;
    supportEmail: string;
    maintenanceMode: boolean;
    allowRegistrations: boolean;
    defaultLanguage: string;
    timezone: string;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    bookingReminders: boolean;
    paymentAlerts: boolean;
    systemAlerts: boolean;
  };
  payments: {
    currency: string;
    taxRate: number;
    minimumBookingAmount: number;
    maximumBookingAmount: number;
    refundPolicy: string;
    paymentMethods: {
      card: boolean;
      bank: boolean;
      wallet: boolean;
    };
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    requireTwoFactor: boolean;
    passwordMinLength: number;
    allowPasswordReset: boolean;
    ipWhitelist: string[];
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: string;
    retentionPeriod: number;
    backupLocation: string;
  };
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    general: {
      siteName: "Mentor Meet",
      siteDescription: "Монгол багш, суралцагчдыг холбох платформ",
      supportEmail: "support@mentormeet.mn",
      maintenanceMode: false,
      allowRegistrations: true,
      defaultLanguage: "mn",
      timezone: "Asia/Ulaanbaatar",
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      bookingReminders: true,
      paymentAlerts: true,
      systemAlerts: true,
    },
    payments: {
      currency: "MNT",
      taxRate: 10,
      minimumBookingAmount: 50000,
      maximumBookingAmount: 1000000,
      refundPolicy: "7d",
      paymentMethods: {
        card: true,
        bank: true,
        wallet: false,
      },
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      requireTwoFactor: false,
      passwordMinLength: 8,
      allowPasswordReset: true,
      ipWhitelist: [],
    },
    email: {
      smtpHost: "smtp.gmail.com",
      smtpPort: 587,
      smtpUsername: "",
      smtpPassword: "",
      fromEmail: "noreply@mentormeet.mn",
      fromName: "Mentor Meet",
    },
    backup: {
      autoBackup: true,
      backupFrequency: "daily",
      retentionPeriod: 30,
      backupLocation: "cloud",
    },
  });

  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { key: "general", label: "Ерөнхий", icon: Settings },
    { key: "notifications", label: "Мэдэгдэл", icon: Bell },
    { key: "payments", label: "Төлбөр", icon: CreditCard },
    { key: "security", label: "Аюулгүй байдал", icon: Shield },
    { key: "email", label: "Имэйл тохиргоо", icon: Mail },
    { key: "backup", label: "Нөөцлөлт", icon: Database },
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section: keyof SettingsData, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNestedChange = (section: keyof SettingsData, parent: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: {
          ...(prev[section] as any)[parent],
          [field]: value,
        },
      },
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Сайтын нэр
          </label>
          <input
            type="text"
            value={settings.general.siteName}
            onChange={(e) => handleInputChange("general", "siteName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Дэмжлэгийн имэйл
          </label>
          <input
            type="email"
            value={settings.general.supportEmail}
            onChange={(e) => handleInputChange("general", "supportEmail", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Сайтын тайлбар
        </label>
        <textarea
          value={settings.general.siteDescription}
          onChange={(e) => handleInputChange("general", "siteDescription", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Үндсэн хэл
          </label>
          <select
            value={settings.general.defaultLanguage}
            onChange={(e) => handleInputChange("general", "defaultLanguage", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="mn">Монгол</option>
            <option value="en">English</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Цагийн бүс
          </label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleInputChange("general", "timezone", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Asia/Ulaanbaatar">Улаанбаатар</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Засвар үйлчилгээний горим</h4>
            <p className="text-sm text-gray-500">Сайтыг түр хаах</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.general.maintenanceMode}
              onChange={(e) => handleInputChange("general", "maintenanceMode", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Бүртгэл зөвшөөрөх</h4>
            <p className="text-sm text-gray-500">Шинэ хэрэглэгчдийн бүртгэлийг зөвшөөрөх</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.general.allowRegistrations}
              onChange={(e) => handleInputChange("general", "allowRegistrations", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {Object.entries(settings.notifications).map(([key, value]) => {
          const labels: Record<string, string> = {
            emailNotifications: "Имэйл мэдэгдэл",
            smsNotifications: "SMS мэдэгдэл",
            pushNotifications: "Push мэдэгдэл",
            bookingReminders: "Захиалгын сануулга",
            paymentAlerts: "Төлбөрийн мэдэгдэл",
            systemAlerts: "Системийн мэдэгдэл",
          };

          const descriptions: Record<string, string> = {
            emailNotifications: "Имэйлээр мэдэгдэл илгээх",
            smsNotifications: "SMS-ээр мэдэгдэл илгээх",
            pushNotifications: "Браузерын мэдэгдэл илгээх",
            bookingReminders: "Захиалгын сануулга илгээх",
            paymentAlerts: "Төлбөрийн талаарх мэдэгдэл",
            systemAlerts: "Системийн алдааны мэдэгдэл",
          };

          return (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">{labels[key]}</h4>
                <p className="text-sm text-gray-500">{descriptions[key]}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleInputChange("notifications", key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Валют
          </label>
          <select
            value={settings.payments.currency}
            onChange={(e) => handleInputChange("payments", "currency", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="MNT">Төгрөг (₮)</option>
            <option value="USD">Доллар ($)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Татварын хувь (%)
          </label>
          <input
            type="number"
            value={settings.payments.taxRate}
            onChange={(e) => handleInputChange("payments", "taxRate", parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Хамгийн бага захиалгын дүн
          </label>
          <input
            type="number"
            value={settings.payments.minimumBookingAmount}
            onChange={(e) => handleInputChange("payments", "minimumBookingAmount", parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Хамгийн их захиалгын дүн
          </label>
          <input
            type="number"
            value={settings.payments.maximumBookingAmount}
            onChange={(e) => handleInputChange("payments", "maximumBookingAmount", parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Буцаалтын бодлого
        </label>
        <select
          value={settings.payments.refundPolicy}
          onChange={(e) => handleInputChange("payments", "refundPolicy", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="1d">1 хоног</option>
          <option value="3d">3 хоног</option>
          <option value="7d">7 хоног</option>
          <option value="14d">14 хоног</option>
          <option value="30d">30 хоног</option>
        </select>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Төлбөрийн аргууд</h4>
        {Object.entries(settings.payments.paymentMethods).map(([key, value]) => {
          const labels: Record<string, string> = {
            card: "Банкны карт",
            bank: "Банкны шилжүүлэг",
            wallet: "Цахим хэтэвч",
          };

          return (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium text-gray-900">{labels[key]}</h5>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleNestedChange("payments", "paymentMethods", key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Сессийн хугацаа (минут)
          </label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleInputChange("security", "sessionTimeout", parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Хамгийн их нэвтрэх оролдлого
          </label>
          <input
            type="number"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => handleInputChange("security", "maxLoginAttempts", parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Нууц үгийн хамгийн бага урт
        </label>
        <input
          type="number"
          value={settings.security.passwordMinLength}
          onChange={(e) => handleInputChange("security", "passwordMinLength", parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Хоёр түвшний баталгаажуулалт</h4>
            <p className="text-sm text-gray-500">Нэмэлт аюулгүй байдлын түвшин</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.requireTwoFactor}
              onChange={(e) => handleInputChange("security", "requireTwoFactor", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Нууц үг сэргээхийг зөвшөөрөх</h4>
            <p className="text-sm text-gray-500">Хэрэглэгчид нууц үгээ сэргээх боломж</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.allowPasswordReset}
              onChange={(e) => handleInputChange("security", "allowPasswordReset", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SMTP хост
          </label>
          <input
            type="text"
            value={settings.email.smtpHost}
            onChange={(e) => handleInputChange("email", "smtpHost", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SMTP порт
          </label>
          <input
            type="number"
            value={settings.email.smtpPort}
            onChange={(e) => handleInputChange("email", "smtpPort", parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SMTP хэрэглэгчийн нэр
          </label>
          <input
            type="text"
            value={settings.email.smtpUsername}
            onChange={(e) => handleInputChange("email", "smtpUsername", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SMTP нууц үг
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={settings.email.smtpPassword}
              onChange={(e) => handleInputChange("email", "smtpPassword", e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Илгээгчийн имэйл
          </label>
          <input
            type="email"
            value={settings.email.fromEmail}
            onChange={(e) => handleInputChange("email", "fromEmail", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Илгээгчийн нэр
          </label>
          <input
            type="text"
            value={settings.email.fromName}
            onChange={(e) => handleInputChange("email", "fromName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Автомат нөөцлөлт</h4>
          <p className="text-sm text-gray-500">Тогтмол хугацаанд автоматаар нөөцлөх</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.backup.autoBackup}
            onChange={(e) => handleInputChange("backup", "autoBackup", e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Нөөцлөлтийн давтамж
          </label>
          <select
            value={settings.backup.backupFrequency}
            onChange={(e) => handleInputChange("backup", "backupFrequency", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="hourly">Цаг бүр</option>
            <option value="daily">Өдөр бүр</option>
            <option value="weekly">7 хоног бүр</option>
            <option value="monthly">Сар бүр</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Хадгалах хугацаа (хоног)
          </label>
          <input
            type="number"
            value={settings.backup.retentionPeriod}
            onChange={(e) => handleInputChange("backup", "retentionPeriod", parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Нөөцлөлтийн байршил
        </label>
        <select
          value={settings.backup.backupLocation}
          onChange={(e) => handleInputChange("backup", "backupLocation", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="local">Локал сервер</option>
          <option value="cloud">Үүлэн хадгалалт</option>
          <option value="both">Хоёулаа</option>
        </select>
      </div>

      <div className="flex space-x-4">
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Upload className="h-4 w-4 mr-2" />
          Нөөцлөлт үүсгэх
        </button>
        <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
          <Download className="h-4 w-4 mr-2" />
          Нөөцлөлт татах
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralSettings();
      case "notifications":
        return renderNotificationSettings();
      case "payments":
        return renderPaymentSettings();
      case "security":
        return renderSecuritySettings();
      case "email":
        return renderEmailSettings();
      case "backup":
        return renderBackupSettings();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Системийн тохиргоо</h1>
          <p className="text-gray-600">Платформын тохиргоо болон удирдлага</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : saved ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {loading ? "Хадгалж байна..." : saved ? "Хадгалагдсан" : "Хадгалах"}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <Check className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Тохиргоо амжилттай хадгалагдлаа!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex">
          {/* Sidebar Navigation */}
          <div className="w-64 bg-gray-50 border-r border-gray-200">
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === tab.key
                        ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}