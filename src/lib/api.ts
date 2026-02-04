import axios from "axios";

export const cmsApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CMS_API_URL,
  withCredentials: true,
});

cmsApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      try {
        await cmsApi.post("/logout");
      } catch {}

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
