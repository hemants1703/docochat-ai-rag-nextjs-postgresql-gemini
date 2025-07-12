"use server";

import type { TrainFormState } from "@/components/features/train/train-form";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";

export async function trainDocument(
  initialState: TrainFormState,
  formData: FormData
): Promise<TrainFormState> {
  const file = formData.get("file") as File;

  if (!file) {
    return {
      ...initialState,
      error: new Error("Please upload a file to continue"),
      success: false,
      message: "Please upload a file to continue",
    };
  }

  if (file.size === 0) {
    return {
      ...initialState,
      error: new Error("Please upload a file to continue"),
      success: false,
      message: "Please upload a file to continue",
    };
  }

  try {
    const trainFile = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/document/train`,
      {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      }
    );

    const fileTrainingResponse = await trainFile.json();

    if (!trainFile.ok) {
      throw new Error(fileTrainingResponse.message);
    }

    return {
      ...initialState,
      success: true,
      message: "File trained successfully",
    };
  } catch (error) {
    console.error("Error while training file", error);
    return {
      ...initialState,
      error: new Error("Error while training file"),
      success: false,
      message: "Error while training file",
    };
  }

  // // If no file is uploaded, return an error
  // const uploadedFile: File | null = formData.get("file") as File;

  // if (!uploadedFile || uploadedFile.size === 0) {
  //   return {
  //     ...initialState,
  //     error: new Error("Please upload a file to continue"),
  //     success: false,
  //     message: "Please upload a file to continue",
  //   };
  // }

  // const confirmFileSupport = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_URL}/api/document/confirm-support`,
  //   {
  //     method: "POST",
  //     body: formData,
  //   }
  // );

  // // If the file is not supported, the backend sends a status: 500 error as response
  // if (!confirmFileSupport.ok) {
  //   console.error(
  //     "Error while confirming support for file",
  //     confirmFileSupport
  //   );
  //   return {
  //     file: formData.get("file") as File,
  //     error: new Error("File is not supported"),
  //     success: false,
  //     message: "File is not supported",
  //   };
  // }

  // const fileSupportResponse = await confirmFileSupport.json();

  // console.log("File supported", fileSupportResponse);

  // redirect("/training");

  // return {
  //   file: formData.get("file") as File,
  //   success: true,
  //   message: "File is supported",
  // };
}
