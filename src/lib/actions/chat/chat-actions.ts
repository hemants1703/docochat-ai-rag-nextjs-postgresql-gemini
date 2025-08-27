"use server";

import { ChatMessageFormState } from "@/components/features/chat/chat-input";
import { chatMessageSchema } from "./definitions";
import { createClient } from "../../../../supabase/server";
import { embedText } from "@/lib/api-services/train/text-embedding-services";
import { revalidatePath } from "next/cache";
import { GoogleGenAI } from "@google/genai";

export async function sendMessage(
  previousState: ChatMessageFormState,
  formData: FormData
): Promise<ChatMessageFormState> {
  const validatedFields = chatMessageSchema.safeParse({
    role: previousState.role,
    userTypedMessage: formData.get("userTypedMessage"),
    userDetails: JSON.parse(formData.get("userDetails") as string),
  });

  if (!validatedFields.success) {
    return previousState;
  }

  const embedding = await embedText(validatedFields.data.userTypedMessage);

  if (embedding instanceof Error) {
    console.error("Error embedding text", embedding);
    return previousState;
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("match_trained_documents", {
    query_embedding: embedding.embeddings?.[0].values,
    match_threshold: 0.1,
    match_count: 10,
  });

  if (error) {
    console.error("Error matching documents", error);
    return previousState;
  }

  const fileContent = data.length > 0 ? data[0].file_content : "";

  const systemPrompt = fileContent
    ? `
  You are a helpful assistant that can answer questions and help with tasks. The user has uploaded documents to the system. The uploaded document's content is this: ${fileContent}
  `
    : "You are a helpful assistant that can answer questions and help with tasks. The user has uploaded documents to the system and you already have the context for that";

  let previousMessages;
  try {
    const { data: messages, error: messagesError } = await supabase
      .from("chats_store")
      .select("*")
      .eq("user_id", validatedFields.data.userDetails.id);

    if (messagesError) {
      throw new Error(messagesError.message);
    }

    previousMessages = messages?.map((message) => ({
      role: message.role,
      parts: [{ text: message.message }],
    }));
  } catch (error) {
    console.error("Error fetching previous messages", error);
    return {
      ...previousState,
      error:
        error instanceof Error
          ? error.message
          : "Error fetching previous messages",
    };
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  let chatResponse;
  let assistantContent;

  try {
    chatResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: [
        ...(previousMessages || []),
        {
          role: "user",
          parts: [{ text: validatedFields.data.userTypedMessage }],
        },
      ],
      config: {
        systemInstruction: systemPrompt,
      },
    });

    assistantContent = chatResponse.text;

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
      ])
      .select();

    if (chatError) {
      console.error("Error inserting chat data", chatError);
    }
  } catch (error) {
    console.error("Error sending message", error);
    return {
      ...previousState,
      error:
        error instanceof Error ? error.message : "Gemini API returned an error",
    };
  }

  revalidatePath("/chat");

  return {
    role: "assistant",
    content: "",
    completions: assistantContent,
    userDetails: validatedFields.data.userDetails,
  };
}
