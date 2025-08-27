"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trainDocument } from "@/lib/actions/train/document-actions";
import { CircuitBoardIcon, Loader2Icon, XIcon } from "lucide-react";
import { useActionState, useState, useRef, useEffect } from "react";
import PreviewSelectedFile from "./preview-selected-file";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { QuotaExceeded, UserDetails } from "@/app/train/page";
import { createClient } from "../../../../supabase/client";
import { redirect } from "next/navigation";
import { generateRandomUUID } from "@/lib/actions/train/uuid-generator";

export interface TrainFormState {
  file: File | null;
  error?: Error | undefined;
  success?: boolean | undefined;
  message?: string | undefined;
}

export default function TrainForm() {
  // React Hooks
  const [formState, formAction, isResponsePending] = useActionState<
    TrainFormState,
    FormData
  >(trainDocument, {
    file: null,
    error: undefined,
    success: undefined,
    message: undefined,
  });
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const createUserInSupabase = async () => {
    const newUserDetails: UserDetails = {
      id: generateRandomUUID(),
      username: "test",
      credits_available: 10,
      credits_used: 0,
      files_available: 1,
      files_used: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const createUserInSupabase = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/create-user`,
        {
          method: "POST",
          body: JSON.stringify(newUserDetails),
        }
      );

      const createUserInSupabaseResponse = await createUserInSupabase.json();

      if (!createUserInSupabase.ok) {
        throw new Error(createUserInSupabaseResponse.statusText);
      }

      localStorage.setItem("user-docochat-ai", JSON.stringify(newUserDetails));
      setUserDetails(newUserDetails);
    } catch (error) {
      console.error("Error while creating user in Supabase", error);
    }
  };

  // Initialize user details
  useEffect(() => {
    const userDetails = localStorage.getItem("user-docochat-ai");

    // If user details are not found, then only create a new user
    if (!userDetails) {
      createUserInSupabase();
    } else {
      setUserDetails(JSON.parse(userDetails));
    }
  }, []);

  const updateUserDetails = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userDetails?.id);

    if (error) {
      console.error("Error while updating user details", error);
      toast.error("Error while updating user details", {
        description: error.message,
      });
      return;
    }

    setUserDetails(data[0]);

    localStorage.setItem("user-docochat-ai", JSON.stringify(data[0]));

    redirect("/chat");
  };

  // Update user details
  useEffect(() => {
    if (formState.success) {
      updateUserDetails();
    }
  }, [formState.message]);

  if (!userDetails) {
    return (
      <div className="flex items-center justify-center gap-2">
        <Loader2Icon className="h-4 w-4 animate-spin" />
        <p className="text-sm text-gray-500">Loading user details...</p>
      </div>
    );
  }

  if (userDetails.files_used >= userDetails.files_available) {
    return <QuotaExceeded />;
  }

  // Handle File to detect support
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;

    if (!selectedFile) {
      setFileSelected(null);
      toast.error("Please select a file to upload");
    }

    setFileSelected(selectedFile);

    // Confirm file support
    try {
      const formData: FormData = new FormData();
      formData.append("file", selectedFile as File);

      const confirmFileSupport: Response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/document/confirm-support`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!confirmFileSupport.ok) {
        throw new Error((await confirmFileSupport.json()).message);
      }

      const fileSupportResponse = await confirmFileSupport.json();

      toast.success("Success", {
        description: fileSupportResponse.message,
      });
    } catch (error) {
      setFileSelected(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      console.error("File not supported: ", error);
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Unsupported File",
      });
    }
  };

  return (
    <form action={formAction}>
      <Toaster />
      {/* File Input */}
      <div className="flex items-center gap-2">
        <Input
          type="file"
          name="file"
          accept=".pdf,.txt,.md,.rtf"
          className="w-full"
          ref={fileInputRef}
          disabled={isResponsePending}
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="destructive"
          disabled={isResponsePending || !fileSelected}
          title="Clear file"
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
              setFileSelected(null);
              formState.error = undefined;
            }
          }}
        >
          <XIcon className="size-4" />
        </Button>
      </div>

      <Input
        type="hidden"
        name="userDetails"
        value={JSON.stringify(userDetails)}
      />

      {/* Preview Uploaded File */}
      {fileSelected !== null ? (
        <PreviewSelectedFile file={fileSelected} />
      ) : (
        <p className="text-sm text-gray-500">No file selected</p>
      )}

      {/* Error and Success Messages */}
      {formState.error && (
        <p className="text-red-500 text-sm mt-2">{formState.error.message}</p>
      )}
      {formState.success && (
        <p className="text-green-500 text-sm mt-2">{formState.message}</p>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isResponsePending || !fileSelected}
        className="w-full mt-4"
      >
        {isResponsePending ? (
          <>
            <Loader2Icon className="h-4 w-4 animate-spin" />
            Traininig AI with your file...
          </>
        ) : (
          <>
            <CircuitBoardIcon className="h-4 w-4" />
            Train AI with your file
          </>
        )}
      </Button>
    </form>
  );
}
