"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendMessage } from "@/lib/actions/chat/chat-actions";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInput() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [formState, formAction, isFormPending] = useActionState<
    ChatMessage,
    FormData
  >(sendMessage, { role: "user", content: "" });

  useEffect(() => {
    if (formState.role === "assistant" && textareaRef.current) {
      textareaRef.current.value = "";
    }
  }, [formState]);

  return (
    <form action={formAction} className="flex items-center gap-2">
      <Textarea
        ref={textareaRef}
        name="userTypedMessage"
        placeholder="Type your message here..."
        className="resize-none"
        rows={1}
      />
      <Button type="submit" disabled={isFormPending}>
        {isFormPending ? (
          <Loader2Icon className="w-4 h-4 animate-spin" />
        ) : (
          <ArrowUpIcon className="w-4 h-4" />
        )}
      </Button>
    </form>
  );
}
