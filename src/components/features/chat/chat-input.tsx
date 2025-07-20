"use client";

import { UserDetails } from "@/app/train/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendMessage } from "@/lib/actions/chat/chat-actions";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  completions?: string;
  userDetails: UserDetails;
}

export default function ChatInput(props: {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  setGptResponse: (response: string) => void;
  userDetails: UserDetails;
  handleMessageSent: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [formState, formAction, isFormPending] = useActionState<
    ChatMessage,
    FormData
  >(sendMessage, { role: "user", content: "", userDetails: props.userDetails });

  useEffect(() => {
    if (
      formState.role === "assistant" &&
      formState.completions &&
      textareaRef.current
    ) {
      textareaRef.current.value = "";
      props.setGptResponse(formState.completions);
      props.handleMessageSent();
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
        onChange={(e) => props.setInputMessage(e.target.value)}
        disabled={!props.userDetails}
      />
      <Input
        type="hidden"
        name="userDetails"
        value={JSON.stringify(props.userDetails)}
      />
      <Button type="submit" disabled={isFormPending || !props.inputMessage}>
        {isFormPending ? (
          <Loader2Icon className="w-4 h-4 animate-spin" />
        ) : (
          <ArrowUpIcon className="w-4 h-4" />
        )}
      </Button>
    </form>
  );
}
