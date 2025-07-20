import { UserDetails } from "@/app/train/page";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../supabase/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const userDetails: UserDetails | null = await request.json();

  if (!userDetails) {
    return NextResponse.json(
      {
        message: "User details not found",
      },
      {
        status: 400,
        statusText: "Bad Request",
      }
    );
  }

  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from("users").insert({
      id: userDetails.id,
      username: userDetails.username,
      credits_available: userDetails.credits_available,
      credits_used: userDetails.credits_used,
      files_available: userDetails.files_available,
      files_used: userDetails.files_used,
      created_at: userDetails.created_at,
      updated_at: userDetails.updated_at,
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(
      { message: "User created successfully" },
      {
        status: 201,
        statusText: "Created",
      }
    );
  } catch (error) {
    console.error("Error while creating user", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error while creating user";
    return NextResponse.json(
      {
        message: errorMessage,
      },
      {
        status: 500,
        statusText: errorMessage,
      }
    );
  }

  console.log("userDetails", userDetails);

  return NextResponse.json({ message: "User created successfully" });
}
