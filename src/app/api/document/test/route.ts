import {
  extractTextFromCSV,
  extractTextFromDOCX,
} from "@/lib/api-services/train/text-extraction-services";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  console.log("file", file);

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const text = await extractTextFromCSV(file);

  return NextResponse.json({ text });
}
