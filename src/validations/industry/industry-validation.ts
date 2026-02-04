import { z } from "zod";

export const createIndustrySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters"),

  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only",
    ),

  description: z.string().optional(),

  icon: z.string().optional(),

  color: z.string().optional(),

  order: z.number().optional(),
});

export const updateIndustrySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters"),

  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only",
    ),

  description: z.string().optional(),

  icon: z.string().optional(),

  color: z.string().optional(),

  order: z.number().optional(),

  isActive: z.enum(["true", "false"], {
    message: "Status is required",
  }),
});

export type CreateIndustryForm = z.infer<typeof createIndustrySchema>;
export type UpdateIndustryForm = z.infer<typeof updateIndustrySchema>;
