"use server";

import { ChatMessage } from "@/components/features/chat/chat-input";
import { chatMessageSchema } from "./definitions";
import OpenAI from "openai";

export async function sendMessage(
  previousState: ChatMessage,
  formData: FormData
): Promise<ChatMessage> {
  const validatedFields = chatMessageSchema.safeParse({
    role: previousState.role,
    userTypedMessage: formData.get("userTypedMessage"),
  });

  if (!validatedFields.success) {
    return previousState;
  }

  const openAIClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await openAIClient.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that can answer questions and help with tasks.",
      },
      { role: "user", content: validatedFields.data.userTypedMessage },
    ],
  });

  const assistantContent =
    completion.choices[0]?.message.content || "No response";

  return {
    role: "assistant",
    content: assistantContent,
  };
}
