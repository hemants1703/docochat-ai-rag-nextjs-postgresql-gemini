import { z } from "zod";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  userTypedMessage: z.string().min(1, { message: "Message is required" }),
  userDetails: z
    .object({
      id: z.string(),
      username: z.string(),
      credits_available: z.number(),
      credits_used: z.number(),
      files_available: z.number(),
      files_used: z.number(),
      created_at: z.string(),
      updated_at: z.string(),
    })
    .required(),
});
