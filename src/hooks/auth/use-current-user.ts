import { useEffect, useState } from "react";
import { cmsApi } from "@/lib/api";

export type UserRole =
  | "ADMIN"
  | "MARKETING_EDITOR"
  | "TECHNICAL_EDITOR"
  | "VIEWER";

export interface CurrentUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cmsApi
      .get("/me")
      .then((res) => setUser(res.data))
      .catch(async (error) => {
        setUser(null);
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          try {
            await cmsApi.post("/logout");
          } catch {}
          window.location.href = "/login";
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return { user, role: user?.role, loading };
}
