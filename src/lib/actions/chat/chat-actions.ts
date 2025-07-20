"use server";

import { ChatMessage } from "@/components/features/chat/chat-input";
import { chatMessageSchema } from "./definitions";
import OpenAI from "openai";
import { createClient } from "../../../../supabase/server";
import { embedText } from "@/lib/api-services/train/text-embedding-service";
import { revalidatePath } from "next/cache";

export async function sendMessage(
  previousState: ChatMessage,
  formData: FormData
): Promise<ChatMessage> {
  const validatedFields = chatMessageSchema.safeParse({
    role: previousState.role,
    userTypedMessage: formData.get("userTypedMessage"),
    userDetails: JSON.parse(formData.get("userDetails") as string),
  });

  if (!validatedFields.success) {
    return previousState;
  }

  const embedding = await embedText(
    validatedFields.data.userTypedMessage,
    "text-embedding-3-small"
  );

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: embedding.data[0].embedding,
    match_threshold: 0.5,
    match_count: 10,
  });

  if (error) {
    console.error("Error matching documents", error);
  }

  const fileContent = data.length > 0 ? data[0].file_content : "";

  const systemPrompt = fileContent
    ? `
  You are a helpful assistant that can answer questions and help with tasks. The user has uploaded documents to the system. The uploaded document's content is this: ${fileContent}
  `
    : "You are a helpful assistant that can answer questions and help with tasks. The user has uploaded documents to the system and you already have the context for that";

  const { data: messages, error: messagesError } = await supabase
    .from("chats_store")
    .select("*")
    .eq("user_id", validatedFields.data.userDetails.id);

  const previousMessages = messages?.map((message) => ({
    role: message.role,
    content: message.message,
  }));

  const openAIClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await openAIClient.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...(previousMessages || []),
      { role: "user", content: validatedFields.data.userTypedMessage },
    ],
  });

  const assistantContent =
    completion.choices[0]?.message.content || "No response";

  console.log("Assistant Content", assistantContent);

  const { data: chatData, error: chatError } = await supabase
    .from("chats_store")
    .insert([
      {
        user_id: validatedFields.data.userDetails.id,
        role: "user",
        message: validatedFields.data.userTypedMessage,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: validatedFields.data.userDetails.id,
        role: "assistant",
        message: assistantContent,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

  if (chatError) {
    console.error("Error inserting chat data", chatError);
  }

  revalidatePath("/chat");

  return {
    role: "assistant",
    content: "",
    completions: assistantContent,
    userDetails: validatedFields.data.userDetails,
  };
}
