// app/api/save-list/route.ts - FINAL, CLEAN, CONSOLIDATED VERSION
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

// In production, this would be a database.
// For now, we'll use a simple in-memory store for demonstrations/sharing.
// NOTE: This Map will reset every time the server restarts.
const savedLists = new Map<string, any>();

// The POST handler saves the list and generates a unique share ID
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packingList, tripContext } = body;

    if (
      !packingList ||
      !Array.isArray(packingList) ||
      packingList.length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid or empty packing list format" },
        { status: 400 }
      );
    }

    // Generate unique ID
    const listId = nanoid(10);

    // Save list data
    const listData = {
      id: listId,
      packingList,
      tripContext,
      createdAt: new Date().toISOString(),
      views: 0,
    };

    // Save to memory
    savedLists.set(listId, listData);

    // Ensure the shareUrl returns the full path correctly
    const shareUrl = `${
      process.env.NEXT_PUBLIC_BASE_URL || "https://packmind.ai"
    }/list/${listId}`;

    return NextResponse.json({
      success: true,
      listId,
      shareUrl,
      message: "List saved successfully",
    });
  } catch (error: any) {
    console.error("Save list error:", error);
    return NextResponse.json(
      { error: "Failed to save list", details: error.message },
      { status: 500 }
    );
  }
}

// The GET handler retrieves the list data using the ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const listId = searchParams.get("id");

    if (!listId) {
      return NextResponse.json(
        { error: "List ID is required" },
        { status: 400 }
      );
    }

    // Retrieve from memory
    const listData = savedLists.get(listId);

    if (!listData) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    // Increment view count
    listData.views = (listData.views || 0) + 1;
    savedLists.set(listId, listData);

    return NextResponse.json({
      success: true,
      data: listData,
    });
  } catch (error: any) {
    console.error("Get list error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve list", details: error.message },
      { status: 500 }
    );
  }
}
