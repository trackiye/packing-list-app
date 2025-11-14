// app/api/save-list/route.ts - FINAL, CLEAN, CONSOLIDATED, AND TYPE-SAFE VERSION
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

// 1. Define the interfaces for stored data and request body
interface PackingItem {
  item_name: string;
  description: string;
  category: string;
}

interface ListData {
  id: string;
  packingList: PackingItem[];
  tripContext: string | undefined;
  createdAt: string;
  views: number;
}

// REMOVED: interface PostBody { ... } which caused the warning

// In production, this would be a database.
// We use a Map with the defined interface.
const savedLists = new Map<string, ListData>(); // FIX: Use ListData type

// The POST handler saves the list and generates a unique share ID
export async function POST(request: NextRequest) {
  try {
    // NOTE: This assumes Zod validation will be re-added here.
    // For now, we must trust the incoming JSON since the Zod dependency is pending resolution.
    const body: {
      packingList: PackingItem[];
      tripContext: string | undefined;
    } = await request.json();
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

    // Create list data object
    const listData: ListData = {
      id: listId,
      packingList: packingList,
      tripContext: tripContext,
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
  } catch (error: unknown) {
    // FIX: Use unknown for catch argument
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Save list error:", error);
    return NextResponse.json(
      { error: "Failed to save list", details: errorMessage },
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

    // Increment view count and update Map
    listData.views = (listData.views || 0) + 1;
    savedLists.set(listId, listData);

    return NextResponse.json({
      success: true,
      data: listData,
    });
  } catch (error: unknown) {
    // FIX: Use unknown for catch argument
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Get list error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve list", details: errorMessage },
      { status: 500 }
    );
  }
}
