import { UserRole } from "@/hooks/auth/use-current-user";

export const canCreate = (role?: UserRole) =>
  ["ADMIN", "MARKETING_EDITOR", "TECHNICAL_EDITOR"].includes(role ?? "");

export const canEdit = (role?: UserRole) =>
  ["ADMIN", "MARKETING_EDITOR", "TECHNICAL_EDITOR"].includes(role ?? "");

export const canDelete = (role?: UserRole) => role === "ADMIN";

export const canBulkDelete = (role?: UserRole) => role === "ADMIN";

export const isAdmin = (role?: UserRole) => role === "ADMIN";
