import ChatSidebarContent from "@/components/features/chat/chat-sidebar-content";

export const metadata = {
  title: "Chat with your documents",
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col h-svh bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      {/* <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center w-full text-gray-900 dark:text-gray-100 tracking-tight">
          Welcome to Docochat AI! Start chatting with your documents.
        </h1>
      </header> */}
      <section className="flex flex-1">
        <Sidebar />
        <div className="flex flex-1 flex-col h-screen overflow-y-auto bg-white dark:bg-gray-800">
          {children}
        </div>
      </section>
    </main>
  );
}

export function Sidebar() {
  return (
    <aside className="w-64 p-4 border-r border-gray-200 dark:border-gray-700 h-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
        Uploaded Documents
      </h2>
      <ChatSidebarContent />
    </aside>
  );
}
