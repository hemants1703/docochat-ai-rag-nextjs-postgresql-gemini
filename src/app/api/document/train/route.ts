import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../supabase/server";
import {
  SupportedFileType,
  supportedFileTypes,
} from "@/lib/supportedFileTypes";
import { extractTextFromTXTOrMD } from "@/lib/api-services/train/text-extraction-services";
import { chunkText } from "@/lib/api-services/train/text-chunking-services";
import OpenAI from "openai";
import { embedChunkedText } from "@/lib/api-services/train/text-embedding-service";

export default async function POST(
  request: NextRequest
): Promise<NextResponse<{ message: string; error?: Error }>> {
  const formData: FormData = await request.formData();
  const fileContent: File = formData.get("file") as File;

  const fileType: SupportedFileType | undefined = supportedFileTypes.find(
    (fileType: SupportedFileType) => {
      return fileType.mime === fileContent.type;
    }
  );

  if (!fileType) {
    return NextResponse.json(
      {
        message: "Unsupported file type",
      },
      {
        status: 400,
        statusText: "Bad Request",
      }
    );
  }

  const supabase = await createClient();

  switch (fileType.ext) {
    case "txt":
    case "md":
      try {
        const extractedText: string = await extractTextFromTXTOrMD(fileContent); // Extract text from TXT/MD file(s)
        const textChunks: string[] = await chunkText(extractedText, 100, 20); // Chunk the extracted text into smaller chunks
        const textEmbeddings: OpenAI.Embeddings.CreateEmbeddingResponse =
          await embedChunkedText(textChunks, "text-embedding-3-small"); // Embed the text chunks using OpenAI's text-embedding-3-small model
        const { data, error } = await supabase.from("vector_store").insert({
          user_id: "test",
          content: extractedText,
          vectors: textEmbeddings.data.map(
            (embedding: OpenAI.Embeddings.Embedding) => embedding.embedding
          ),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (error) {
          throw new Error(error.message);
        }

        console.log({
          user_id: "test",
          content: extractedText,
          textChunks,
          textEmbeddings,
          vectors: textEmbeddings.data.map(
            (embedding: OpenAI.Embeddings.Embedding) => embedding.embedding
          ),
          data,
        });

        return NextResponse.json(
          {
            message: "File trained successfully",
          },
          {
            status: 200,
            statusText: "OK",
          }
        );
      } catch (error) {
        console.error("Error while training file", error);
        return NextResponse.json(
          {
            message:
              error instanceof Error
                ? error.message
                : "Error while training file",
          },
          {
            status: 500,
            statusText: "Internal Server Error",
          }
        );
      }
      break;
    default:
      break;
  }

  return NextResponse.json(
    {
      message: "File trained successfully",
    },
    { status: 200 }
  );
}
