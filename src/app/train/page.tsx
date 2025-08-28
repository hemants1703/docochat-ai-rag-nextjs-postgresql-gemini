import TrainForm from "@/components/features/train/train-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface UserDetails {
  id: string;
  username: string;
  credits_available: number;
  credits_used: number;
  files_available: number;
  files_used: number;
  created_at: string;
  updated_at: string;
}

export default async function TrainPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <section className="w-full max-w-md rounded-2xl shadow-lg p-6 flex flex-col gap-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <header className="text-center">
          <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-gray-100 tracking-tight">
            Train Your Documents
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300">
            Upload one or more documents and start chatting with them instantly.
            Supported formats: PDF, TXT, MD, RTF, DOCX & CSV.
          </p>
        </header>
        <TrainForm />
      </section>
    </main>
  );
}

export function QuotaExceeded() {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <p className="text-sm text-gray-500">
        You have reached the maximum number of files available.
      </p>{" "}
      <Button asChild variant={"link"}>
        <Link prefetch={true} href="/chat">
          Go to chat
        </Link>
      </Button>
    </div>
  );
}
