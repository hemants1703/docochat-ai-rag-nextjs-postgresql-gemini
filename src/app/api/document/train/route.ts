import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../supabase/server";
import {
  SupportedFileType,
  supportedFileTypes,
} from "@/lib/supportedFileTypes";
import {
  extractTextFromRTF,
  extractTextFromTXTOrMD,
} from "@/lib/api-services/train/text-extraction-services";
import { chunkText } from "@/lib/api-services/train/text-chunking-services";
import OpenAI from "openai";
import { embedChunkedText } from "@/lib/api-services/train/text-embedding-service";
import { UserDetails } from "@/app/train/page";

export async function POST(
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
  const userDetails: UserDetails = JSON.parse(
    formData.get("userDetails") as string
  ) as UserDetails;

  const supabase = await createClient();

  // Check if the user has reached the maximum number of files available
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userDetails.id);

  if (error) {
    throw new Error(error.message);
  }

  if (data && data[0].files_available === 0) {
    return NextResponse.json(
      {
        message: "You have reached the maximum number of files available",
      },
      {
        status: 400,
        statusText: "Bad Request",
      }
    );
  }

  switch (fileType.ext) {
    case "txt":
    case "md":
      try {
        const extractedText: string = await extractTextFromTXTOrMD(fileContent); // Extract text from TXT/MD file(s)
        const textChunks: string[] = await chunkText(extractedText, 100, 20); // Chunk the extracted text into smaller chunks
        const textEmbeddings: OpenAI.Embeddings.CreateEmbeddingResponse =
          await embedChunkedText(textChunks, "text-embedding-3-small"); // Embed the text chunks using OpenAI's text-embedding-3-small model

        // Insert one row per text chunk with its corresponding vector
        const insertPromises = textEmbeddings.data.map((embedding, index) => {
          return supabase.from("vector_store").insert({
            user_id: "test",
            content: textChunks[index],
            vectors: embedding.embedding,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        });

        const results = await Promise.all(insertPromises);

        // Check for any errors in the insertions
        for (const result of results) {
          if (result.error) {
            throw new Error(result.error.message);
          }
        }

        console.log({
          user_id: "test",
          content: extractedText,
          textChunks,
          textEmbeddings,
          vectors: textEmbeddings.data.map(
            (embedding: OpenAI.Embeddings.Embedding) => embedding.embedding
          ),
          data: results,
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
        console.error("Error while training TXT/MD file", error);
        return NextResponse.json(
          {
            message:
              error instanceof Error
                ? error.message
                : "Error while training TXT/MD file",
          },
          {
            status: 500,
            statusText: "Internal Server Error: TXT/MD file",
          }
        );
      }
      break;
    case "rtf":
      try {
        console.log("extracting text from RTF file");
        const extractedText: string = await extractTextFromRTF(fileContent); // Extract text from RTF file
        const textChunks: string[] = await chunkText(extractedText, 100, 20); // Chunk the extracted text into smaller chunks
        const textEmbeddings: OpenAI.Embeddings.CreateEmbeddingResponse =
          await embedChunkedText(textChunks, "text-embedding-3-small"); // Embed the text chunks using OpenAI's text-embedding-3-small model

        // Insert one row per text chunk with its corresponding vector
        const insertPromises = textEmbeddings.data.map((embedding, index) => {
          return supabase.from("vector_store").insert({
            user_id: userDetails.id,
            file_name: fileContent.name,
            file_type: fileType.ext,
            file_size: fileContent.size,
            file_content: extractedText,
            content: textChunks[index],
            vectors: embedding.embedding,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        });

        const results = await Promise.all(insertPromises);

        // Check for any errors in the insertions
        for (const result of results) {
          if (result.error) {
            throw new Error(result.error.message);
          }
        }

        const { data, error } = await supabase
          .from("users")
          .update({
            files_used: 1,
            files_available: 0,
          })
          .eq("id", userDetails.id);

        if (error) {
          throw new Error(error.message);
        }

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
        console.error("Error while training RTF file", error);
        return NextResponse.json(
          {
            message:
              error instanceof Error
                ? error.message
                : "Error while training RTF file",
          },
          {
            status: 500,
            statusText: "Internal Server Error: RTF file",
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
