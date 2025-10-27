// app/api/export-pdf/route.ts
// Note: This uses a client-side approach with jsPDF
// For server-side PDF generation, you'd use puppeteer or similar

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, tripDetails, format = 'simple' } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid items data' },
        { status: 400 }
      );
    }

    // Since we can't use jsPDF on the server easily without puppeteer,
    // we'll return the data formatted for client-side PDF generation
    // The actual PDF will be generated in the browser using jsPDF

    const pdfData = {
      tripDetails: tripDetails || 'My Packing List',
      generatedDate: new Date().toLocaleDateString(),
      items: items,
      format: format,
      // Metadata for PDF
      metadata: {
        title: `Packing List - ${tripDetails}`,
        author: 'Packmind AI',
        subject: 'Travel Packing List',
        keywords: 'packing, travel, checklist',
      }
    };

    return NextResponse.json(pdfData, { status: 200 });

  } catch (error) {
    console.error('PDF export error:', error);
    return NextResponse.json(
      { error: 'Failed to prepare PDF data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      status: 'ok',
      service: 'PDF Export API',
      supportedFormats: ['simple', 'detailed', 'checklist']
    },
    { status: 200 }
  );
}