import { z } from "zod";

const containsEmoji = (text: string) => {
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}\u{238C}-\u{2454}\u{20D0}-\u{20FF}]/u;

  const strippedText = text.replace(/<[^>]*>/g, "");

  return emojiRegex.test(strippedText);
};

const outcomeSchema = z.object({
  metric: z
    .string()
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .optional(),
  value: z
    .string()
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .optional(),
});

export const CreateCaseStudySchema = z.object({
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
    )
    .max(255, "Slug must not exceed 255 characters"),

  overview: z
    .string()
    .min(1, "Overview is required")
    .min(50, "Overview must be at least 50 characters")
    .max(15000, "Overview must not exceed 15,000 characters")
    .refine((value) => !containsEmoji(value), {
      message: "Overviews should not contain emojis or icons",
    }),

  problem: z
    .string()
    .min(1, "Problem is required")
    .min(50, "Problem must be at least 50 characters")
    .max(15000, "Problem must not exceed 15,000 characters")
    .refine((value) => !containsEmoji(value), {
      message: "Problem should not contain emojis or icons",
    }),

  solution: z
    .string()
    .min(1, "Solution is required")
    .min(50, "Solution must be at least 50 characters")
    .max(15000, "Solution must not exceed 15,000 characters")
    .refine((value) => !containsEmoji(value), {
      message: "Solution should not contain emojis or icons",
    }),

  outcomesDesc: z
    .string()
    .min(1, "Outcomes Description is required")
    .min(50, "Outcomes Description must be at least 50 characters")
    .max(15000, "Outcomes Description must not exceed 15,000 characters")
    .refine((value) => !containsEmoji(value), {
      message: "Outcomes Description should not contain emojis or icons",
    }),

  outcomes: z
    .array(outcomeSchema)
    .min(1, "At least one outcome is required")
    .max(10, "Maximum 10 outcomes allowed"),

  client: z
    .string()
    .min(1, "Client name is required")
    .max(255, "Client name must not exceed 255 characters"),

  thumbnailId: z.string().uuid("Invalid thumbnail ID").optional().nullable(),

  publicationId: z
    .string()
    .uuid("Invalid publication ID")
    .optional()
    .nullable(),

  metaTitle: z
    .string()
    .min(1, "Meta title is required")
    .max(60, "Meta title should not exceed 60 characters"),

  metaDescription: z
    .string()
    .min(1, "Meta description is required")
    .max(160, "Meta description should not exceed 160 characters"),

  seoKeywords: z
    .array(
      z
        .string()
        .min(1, "Keyword cannot be empty")
        .max(50, "Keyword must not exceed 50 characters"),
    )
    .max(10, "Maximum 10 SEO keywords allowed")
    .optional()
    .nullable()
    .default([]),

  status: z.enum(
    [
      "draft",
      "in technical review",
      "in marketing review",
      "approved",
      "published",
      "archived",
    ],
    {
      message:
        "Status must be draft, in technical review, in marketing review, approved, published, archived",
    },
  ),

  publishedAt: z.string().datetime().optional().nullable(),

  isFeatured: z.boolean().default(false),

  serviceId: z.string().uuid("Invalid solution ID"),

  industryId: z.string().uuid("Invalid industry ID"),
});

export const UpdateCaseStudySchema = CreateCaseStudySchema;

export type CreateCaseStudyForm = z.infer<typeof CreateCaseStudySchema>;
export type UpdateCaseStudyForm = z.infer<typeof UpdateCaseStudySchema>;
export type CaseStudyOutcome = z.infer<typeof outcomeSchema>;
