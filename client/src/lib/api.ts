// client/lib/api.ts

import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000",
});

// 📡 Token ба request info log хийх interceptor
api.interceptors.request.use((config) => {
  let token: string | null = null;

  // ✅ SSR үед localStorage байхгүй тул хамгаалалт хийнэ
  if (typeof window !== "undefined") {
    token =
      localStorage.getItem("mentorToken") ||
      localStorage.getItem("studentToken");
  }

  config.headers = config.headers || {};

  // ✅ Token байвал Authorization header-д тохируулна
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("✅ Token added to request:", token);
  } else {
    console.warn("⚠️ No token found in localStorage.");
  }

  // 🔍 Debug info
  console.log("📡 Outgoing request to:", config.baseURL + config.url);
  console.log("📦 Request method:", config.method?.toUpperCase());
  console.log("📤 Request headers:", config.headers);
  if (config.data) console.log("📝 Request data:", config.data);

  return config;
});
