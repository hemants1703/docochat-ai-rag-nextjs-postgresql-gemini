"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trainDocument } from "@/lib/actions/train/document-actions";
import { CircuitBoardIcon, Loader2Icon, XIcon } from "lucide-react";
import { useActionState, useState, useRef } from "react";
import PreviewSelectedFile from "./preview-selected-file";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

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
      const formData = new FormData();
      formData.append("file", selectedFile as File);

      const confirmFileSupport = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/document/confirm-support`,
        {
          method: "POST",
          body: formData,
        }
      );

      const fileSupportResponse = await confirmFileSupport.json();

      if (!confirmFileSupport.ok) {
        throw new Error(fileSupportResponse.message);
      }

      // if (localStorage.getItem("user-docochat-ai")) {
      //   const user = JSON.parse(localStorage.getItem("user-docochat-ai") as string);

      //   if (user)
      // }

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
          accept=".pdf,.docx,.txt,.md,.csv,.rtf"
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
            }
          }}
        >
          <XIcon className="size-4" />
        </Button>
      </div>

      {/* Preview Uploaded File */}
      {fileSelected && <PreviewSelectedFile file={fileSelected} />}

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
