import { z } from "zod";

const containsEmoji = (text: string) => {
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}\u{238C}-\u{2454}\u{20D0}-\u{20FF}]/u;

  const strippedText = text.replace(/<[^>]*>/g, "");

  return emojiRegex.test(strippedText);
};

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
    .min(50, "Content must be at least 50 characters")
    .refine((value) => !containsEmoji(value), {
      message: "Content should not contain emojis or icons",
    }),

  thumbnailId: z.string().uuid("Invalid thumbnail ID").optional().nullable(),

  publicationId: z
    .string()
    .uuid("Invalid publication ID")
    .optional()
    .nullable(),

  metaTitle: z
    .string()
    .max(60, "Meta title should not exceed 60 characters")
    .min(1, "Meta title is required"),

  metaDescription: z
    .string()
    .max(160, "Meta description should not exceed 160 characters")
    .min(1, "Meta description is required"),

  seoKeywords: z
    .array(z.string().min(1, "Keyword cannot be empty"))
    .optional()
    .nullable()
    .default([]),

  status: z.enum(["draft", "published", "scheduled"], {
    message: "Status must be draft, published, or scheduled",
  }),

  publishedAt: z.string().datetime().optional().nullable(),

  scheduledAt: z.string().datetime().optional().nullable(),

  isFeatured: z.boolean(),

  categoryId: z.string().uuid("Category is required"),

  tags: z.array(z.string().uuid()).min(1, "Tags are required"),

  serviceId: z.preprocess(
    (val) => (val === "none" || val === "" ? null : val),
    z.string().uuid("Invalid solution ID").optional().nullable(),
  ),

  industryId: z.preprocess(
    (val) => (val === "none" || val === "" ? null : val),
    z.string().uuid("Invalid industry ID").optional().nullable(),
  ),
});

export const UpdateArticleSchema = CreateArticleSchema;

// export const UpdateArticleSchema = CreateArticleSchema.partial().extend({
//   tags: z
//     .array(z.string().uuid("Invalid tag ID"))
//     .min(1, "At least one tag is required")
//     .optional(),
// });

export type CreateArticleForm = z.infer<typeof CreateArticleSchema>;
export type UpdateArticleForm = z.infer<typeof UpdateArticleSchema>;
