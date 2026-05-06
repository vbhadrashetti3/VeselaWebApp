"use client";

import { localStorageUtil } from "@/utils/localStorageUtil";
import axios from "axios";

const api = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorageUtil.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ✅ Optional: global error handling
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized → redirect to login");
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  },
);

export default api;
