import { z } from "zod";

const seoKeywordSchema = z.object({
  keyword: z.string().min(1, "Keyword is required"),
  order: z.number(),
});

export const CreateArticleSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title must not exceed 255 characters"),

  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only",
    ),

  excerpt: z
    .string()
    .min(1, "Excerpt is required")
    .min(10, "Excerpt must be at least 10 characters"),

  content: z
    .string()
    .min(1, "Content is required")
    .min(50, "Content must be at least 50 characters"),

  thumbnailId: z.string().uuid("Invalid thumbnail ID").optional().nullable(),

  publicationId: z
    .string()
    .uuid("Invalid publication ID")
    .optional()
    .nullable(),

  metaTitle: z
    .string()
    .max(60, "Meta title should not exceed 60 characters")
    .optional()
    .nullable(),

  metaDescription: z
    .string()
    .max(160, "Meta description should not exceed 160 characters")
    .optional()
    .nullable(),

  status: z.enum(["draft", "published", "scheduled"], {
    message: "Status must be draft, published, or scheduled",
  }),

  publishedAt: z.string().datetime().optional().nullable(),

  scheduledAt: z.string().datetime().optional().nullable(),

  isFeatured: z.boolean(),

  categoryId: z.string().uuid("Invalid category ID"),

  tags: z.array(z.string().uuid()).min(1, "Tags are required"),

  seoKeywords: z.array(seoKeywordSchema).default([]),
});

export const UpdateArticleSchema = CreateArticleSchema;

export type CreateArticleForm = z.infer<typeof CreateArticleSchema>;
export type UpdateArticleForm = z.infer<typeof UpdateArticleSchema>;
