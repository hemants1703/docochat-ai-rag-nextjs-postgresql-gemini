import { ChatMessage } from "@/components/features/chat/chat-input";
import OpenAI from "openai";

export async function chat(message: ChatMessage, messages: ChatMessage[]) {
  const openAIClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openAIClient.responses.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "developer",
        content:
          "You are a helpful assistant that can answer questions and help with tasks.",
      },
    ],
  });

  return response.output_text;
}
