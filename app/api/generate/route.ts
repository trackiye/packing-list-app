import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { 
      error: "This API route has been deprecated. Please use /api/chat instead.",
      redirectTo: "/api/chat"
    },
    { status: 410 } // 410 Gone
  );
}
