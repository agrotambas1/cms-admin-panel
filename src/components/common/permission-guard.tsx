"use client";

import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { UserRole } from "@/hooks/auth/use-current-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ReactNode } from "react";

interface PermissionGuardProps {
  children: ReactNode;
  check: (role?: UserRole) => boolean;
  redirectTo?: string;
}

export function PermissionGuard({
  children,
  check,
  redirectTo = "/unauthorized",
}: PermissionGuardProps) {
  const { role, loading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !check(role)) {
      router.replace(redirectTo);
    }
  }, [role, loading]);

  if (loading) return null;
  if (!check(role)) return null;

  return <>{children}</>;
}
