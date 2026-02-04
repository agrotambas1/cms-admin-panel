import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters"),

  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and _",
    ),

  email: z.string().min(1, "Email is required").email("Invalid email address"),

  role: z.string().min(1, "Role is required"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters"),

  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and _",
    ),

  email: z.string().min(1, "Email is required").email("Invalid email address"),

  role: z.string().min(1, "Role is required"),

  isActive: z.enum(["true", "false"], {
    message: "Status is required",
  }),

  password: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 6,
      "Password must be at least 6 characters",
    ),
});

export type CreateUserForm = z.infer<typeof createUserSchema>;
export type UpdateUserForm = z.infer<typeof updateUserSchema>;
