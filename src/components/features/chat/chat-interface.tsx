"use client";

import { UserDetails } from "@/app/train/page";
import ChatInput, { ChatMessage } from "./chat-input";
import ChatMessages from "./chat-messages";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "../../../../supabase/client";

export default function ChatInterface() {
  const [inputMessage, setInputMessage] = useState<string>("");
  const [gptResponse, setGptResponse] = useState<string>("");
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    const userDetails = localStorage.getItem("user-docochat-ai");
    if (userDetails) {
      setUserDetails(JSON.parse(userDetails));
    } else {
      toast.error("User details not found");
    }
  }, []);

  const fetchChats = async () => {
    const supabase = createClient();

    const { data: chats, error } = await supabase
      .from("chats_store")
      .select("*")
      .eq("user_id", userDetails?.id);

    if (error) {
      console.log("No chats found", error);
      setChats([]);
    } else {
      setChats(chats);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [userDetails]);

  const handleMessageSent = async () => {
    fetchChats();
  };

  return (
    <div className="flex flex-col flex-1 space-y-4 h-screen overflow-y-auto">
      <ChatMessages chats={chats} />
      {userDetails ? (
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          setGptResponse={setGptResponse}
          userDetails={userDetails}
          handleMessageSent={handleMessageSent}
        />
      ) : (
        <ChatInputError />
      )}
    </div>
  );
}

export function ChatInputError() {
  return <div>Cannot find user details</div>;
}
