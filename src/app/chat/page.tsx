import ChatInput from "@/components/features/chat/chat-input";

export default function ChatPage() {
  return (
    <section className="flex flex-1 flex-col p-4 max-w-4xl mx-auto">
      {/* Chat UI */}
      <ul className="flex flex-col flex-1 space-y-4">
        <li className="flex flex-col">
          <div className="flex flex-col p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-sm text-gray-900 dark:text-gray-100">
            Welcome to Docochat AI! Start chatting with your documents.
          </div>
        </li>
      </ul>
      {/* Chat Input */}
      <ChatInput />
    </section>
  );
}
