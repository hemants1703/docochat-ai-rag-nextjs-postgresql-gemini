import TrainForm from "@/components/features/train/train-form";
import { Button } from "@/components/ui/button";
import { generateRandomUUID } from "@/lib/actions/train/uuid-generator";
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
  const userDetails: UserDetails = {
    id: generateRandomUUID(),
    username: "test",
    credits_available: 10,
    credits_used: 0,
    files_available: 1,
    files_used: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const createUserInSupabase = async (userDetails: UserDetails) => {
    try {
      const createUserInSupabase = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/create-user`,
        {
          method: "POST",
          body: JSON.stringify(userDetails),
        }
      );

      const createUserInSupabaseResponse = await createUserInSupabase.json();

      if (!createUserInSupabase.ok) {
        throw new Error(createUserInSupabaseResponse.statusText);
      }
    } catch (error) {
      console.error("Error while creating user in Supabase", error);
    }
  };
  createUserInSupabase(userDetails);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <section className="w-full max-w-md rounded-2xl shadow-lg p-6 flex flex-col gap-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <header className="text-center">
          <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-gray-100 tracking-tight">
            Train Your Documents
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300">
            Upload one or more documents and start chatting with them instantly.
            Supported formats: PDF, DOCX, TXT, MD, CSV, RTF.
          </p>
        </header>
        <TrainForm userDetails={userDetails} />
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
