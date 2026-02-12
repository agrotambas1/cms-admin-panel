// import axios from "axios";

// export const cmsApi = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_CMS_API_URL,
//   withCredentials: true,
// });

// cmsApi.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (
//       error.response &&
//       (error.response.status === 401 || error.response.status === 403)
//     ) {
//       try {
//         await cmsApi.post("/logout");
//       } catch {}

//       if (typeof window !== "undefined") {
//         window.location.href = "/login";
//       }
//     }

//     return Promise.reject(error);
//   },
// );

import axios from "axios";

export const cmsApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CMS_API_URL,
  withCredentials: true,
});

cmsApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) return Promise.reject(error);

    const status = error.response.status;
    const url = error.config?.url ?? "";

    if (url.includes("/me") || url.includes("/login")) {
      return Promise.reject(error);
    }

    if (typeof window === "undefined") return Promise.reject(error);

    if (status === 401) {
      try {
        await cmsApi.post("/logout");
      } catch {}
      window.location.href = "/login";
    }

    if (status === 403) {
      window.location.href = "/unauthorized";
    }

    if (status === 404) {
      window.location.href = "/not-found";
    }

    return Promise.reject(error);
  },
);
