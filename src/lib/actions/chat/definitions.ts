import { z } from "zod";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  userTypedMessage: z.string().min(1, { message: "Message is required" }),
});
