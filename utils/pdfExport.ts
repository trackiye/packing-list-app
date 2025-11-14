// utils/pdfExport.ts
// Client-side PDF generation using jsPDF

interface PackingItem {
  item_name: string;
  description: string;
  category: string;
  checked?: boolean;
}

export async function generatePDF(
  items: PackingItem[],
  tripDetails: string,
  format: "simple" | "detailed" | "checklist" = "detailed"
) {
  // Dynamic import to avoid SSR issues
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number = 10) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };

  // Helper function to wrap text
  const wrapText = (text: string, maxWidth: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = doc.getTextWidth(testLine);

      if (testWidth > maxWidth) {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) lines.push(currentLine);
    return lines;
  };

  // HEADER with gradient effect (simulated)
  doc.setFillColor(168, 85, 247); // Purple
  doc.rect(0, 0, pageWidth, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Packmind AI", pageWidth / 2, 15, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Your Smart Packing List", pageWidth / 2, 25, { align: "center" });

  yPosition = 45;

  // TRIP DETAILS
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Trip Details", 20, yPosition);
  yPosition += 8;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const tripLines = wrapText(tripDetails, pageWidth - 40);
  tripLines.forEach((line) => {
    doc.text(line, 20, yPosition);
    yPosition += 6;
  });

  yPosition += 5;

  // GENERATED DATE
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Generated: ${new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    20,
    yPosition
  );
  yPosition += 10;

  // STATISTICS
  const totalItems = items.length;
  const checkedItems = items.filter((item) => item.checked).length;
  const categories = [...new Set(items.map((item) => item.category))];

  doc.setFillColor(245, 243, 255); // Light purple background
  doc.roundedRect(20, yPosition, pageWidth - 40, 20, 3, 3, "F");

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Items: ${totalItems}`, 25, yPosition + 8);
  doc.text(`Packed: ${checkedItems}/${totalItems}`, 80, yPosition + 8);
  doc.text(`Categories: ${categories.length}`, 140, yPosition + 8);

  // Progress bar
  if (totalItems > 0) {
    const progress = (checkedItems / totalItems) * 100;
    doc.setFillColor(220, 220, 220);
    doc.roundedRect(25, yPosition + 12, pageWidth - 50, 4, 2, 2, "F");
    doc.setFillColor(168, 85, 247);
    doc.roundedRect(
      25,
      yPosition + 12,
      ((pageWidth - 50) * progress) / 100,
      4,
      2,
      2,
      "F"
    );
  }

  yPosition += 28;

  // ITEMS BY CATEGORY
  if (format === "detailed" || format === "checklist") {
    categories.forEach((category, _categoryIndex) => {
      // FIX: Added underscore
      checkNewPage(15);

      // Category Header
      doc.setFillColor(168, 85, 247);
      doc.rect(20, yPosition, pageWidth - 40, 10, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(category, 25, yPosition + 7);
      yPosition += 12;

      // Items in category
      const categoryItems = items.filter((item) => item.category === category);

      categoryItems.forEach((item, _itemIndex) => {
        // FIX: Added underscore
        checkNewPage(format === "detailed" ? 25 : 12);

        // Checkbox
        doc.setDrawColor(168, 85, 247);
        doc.setLineWidth(0.5);
        if (item.checked) {
          doc.setFillColor(168, 85, 247);
          doc.rect(22, yPosition, 5, 5, "FD");
          doc.setDrawColor(255, 255, 255);
          doc.setLineWidth(1);
          doc.line(23, yPosition + 2.5, 24, yPosition + 4);
          doc.line(24, yPosition + 4, 26.5, yPosition + 1);
        } else {
          doc.rect(22, yPosition, 5, 5, "D");
        }

        // Item name
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(item.item_name, 30, yPosition + 4);

        if (format === "detailed") {
          yPosition += 6;

          // Description
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(80, 80, 80);
          const descLines = wrapText(item.description, pageWidth - 55);
          descLines.forEach((line) => {
            checkNewPage();
            doc.text(line, 30, yPosition);
            yPosition += 5;
          });

          yPosition += 3;
        } else {
          yPosition += 8;
        }
      });

      yPosition += 5;
    });
  } else {
    // Simple format - all items in one list
    items.forEach((item, _index) => {
      // FIX: Added underscore
      checkNewPage(8);

      // Checkbox
      doc.setDrawColor(168, 85, 247);
      doc.setLineWidth(0.5);
      if (item.checked) {
        doc.setFillColor(168, 85, 247);
        doc.rect(22, yPosition, 5, 5, "FD");
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(1);
        doc.line(23, yPosition + 2.5, 24, yPosition + 4);
        doc.line(24, yPosition + 4, 26.5, yPosition + 1);
      } else {
        doc.rect(22, yPosition, 5, 5, "D");
      }

      // Item name
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`${item.item_name} (${item.category})`, 30, yPosition + 4);

      yPosition += 8;
    });
  }

  // FOOTER on last page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated by Packmind AI - Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  // Save the PDF
  const fileName = `packing-list-${tripDetails
    .substring(0, 30)
    .replace(/[^a-z0-9]/gi, "-")
    .toLowerCase()}-${Date.now()}.pdf`;
  doc.save(fileName);

  return true;
}
