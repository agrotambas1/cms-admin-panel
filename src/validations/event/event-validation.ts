import { z } from "zod";

const containsEmoji = (text: string) => {
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}\u{238C}-\u{2454}\u{20D0}-\u{20FF}]/u;

  const strippedText = text.replace(/<[^>]*>/g, "");

  return emojiRegex.test(strippedText);
};

export const CreateEventSchema = z
  .object({
    eventName: z
      .string()
      .min(1, "Event name is required")
      .min(3, "Event name must be at least 3 characters")
      .max(255, "Event name must not exceed 255 characters"),

    slug: z
      .string()
      .min(1, "Slug is required")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must be lowercase with hyphens only",
      )
      .max(255, "Slug must not exceed 255 characters"),

    excerpt: z
      .string()
      .max(500, "Excerpt must not exceed 500 characters")
      .optional()
      .nullable(),

    description: z
      .string()
      .min(1, "Description is required")
      .min(50, "Description must be at least 50 characters")
      .refine((value) => !containsEmoji(value), {
        message: "Content should not contain emojis or icons",
      }),

    thumbnailId: z.string().uuid("Invalid thumbnail ID").optional().nullable(),

    eventType: z.enum(["webinar", "conference", "roundtable"], {
      message: "Event type must be webinar, conference, or roundtable",
    }),

    eventDate: z.string().datetime("Invalid date and time format"),

    location: z
      .string()
      .max(500, "Location must not exceed 500 characters")
      .optional()
      .nullable(),

    locationType: z.enum(["online", "offline", "hybrid"], {
      message: "Location type must be online, offline, or hybrid",
    }),

    meetingUrl: z
      .string()
      .max(500, "Meeting URL must not exceed 500 characters")
      .optional()
      .nullable(),

    registrationUrl: z
      .string()
      .url("Invalid registration URL")
      .max(500, "Registration URL must not exceed 500 characters")
      .optional()
      .nullable(),

    quota: z
      .number()
      .int("Quota must be a whole number")
      .positive("Quota must be greater than 0")
      .max(10000, "Quota must not exceed 10,000")
      .optional()
      .nullable(),

    status: z.enum(["draft", "published", "archived"], {
      message: "Status must be draft, published, archived",
    }),

    serviceId: z.preprocess(
      (val) => (val === "none" || val === "" ? null : val),
      z.string().uuid("Invalid solution ID").optional().nullable(),
    ),

    industryId: z.preprocess(
      (val) => (val === "none" || val === "" ? null : val),
      z.string().uuid("Invalid industry ID").optional().nullable(),
    ),
  })
  .refine(
    (data) => {
      if (data.locationType === "online" || data.locationType === "hybrid") {
        return !!data.meetingUrl;
      }
      return true;
    },
    {
      message: "Meeting URL is required for online or hybrid events",
      path: ["meetingUrl"],
    },
  )
  .refine(
    (data) => {
      if (data.locationType === "offline" || data.locationType === "hybrid") {
        return !!data.location;
      }
      return true;
    },
    {
      message: "Location is required for offline or hybrid events",
      path: ["location"],
    },
  );

export const UpdateEventSchema = CreateEventSchema;

export type CreateEventForm = z.infer<typeof CreateEventSchema>;
export type UpdateEventForm = z.infer<typeof UpdateEventSchema>;
