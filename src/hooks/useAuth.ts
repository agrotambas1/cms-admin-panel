"use client";
import { useEffect } from "react";
import { cmsApi } from "@/lib/api";

export const useAuth = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    cmsApi.get("/me").catch(async (error) => {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        try {
          await cmsApi.post("/logout");
        } catch {}
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    });
  }, []);
};
