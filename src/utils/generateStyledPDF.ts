import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateStyledPDF(formData: any) {
  // Create a new PDFDocument
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const drawText = (text: string, x: number, y: number, size = 10, font = fontRegular) => {
    page.drawText(text || 'N/A', { x, y, size, font, color: rgb(0, 0, 0) });
  };

  // --- Header ---
  page.drawRectangle({
    x: 0,
    y: height - 80,
    width: width,
    height: 80,
    color: rgb(0.05, 0.2, 0.5), // Dark Blue
  });

  page.drawText('SCHOOL OF NURSING - APPLICATION SLIP', {
    x: 50,
    y: height - 45,
    size: 20,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  // --- Content Sections ---
  let currentY = height - 120;

  const drawSection = (title: string, data: Record<string, any>) => {
    drawText(title.toUpperCase(), 50, currentY, 12, fontBold);
    page.drawLine({
      start: { x: 50, y: currentY - 5 },
      end: { x: 550, y: currentY - 5 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    
    currentY -= 25;

    Object.entries(data).forEach(([key, value]) => {
      drawText(`${key}:`, 60, currentY, 10, fontBold);
      drawText(String(value), 180, currentY, 10, fontRegular);
      currentY -= 18;
    });
    currentY -= 15;
  };

  // 1. Personal Info
  drawSection('Personal Information', {
    'Full Name': formData.fullName,
    'Email': formData.email,
    'Blood Group': formData.bloodGroup,
    'Genotype': formData.genotype,
  });

  // 2. Program Choice
  drawSection('Academic Choice', {
    'Program': formData.program,
    'Mode of Study': formData.mode,
    'Preferred Campus': formData.campus,
  });

  // 3. UTME/JAMB Details
  drawSection('UTME Details', {
    'JAMB Reg No': formData.jambRegNo,
    'JAMB Score': formData.jambScore,
    'Subjects': formData.jambSubjects?.join(', '),
  });

  // 4. O-Level Summary
  const sitting1 = formData.sitting1 ? `${formData.sitting1.examType} (${formData.sitting1.examYear})` : 'N/A';
  drawSection('Examination History', {
    'First Sitting': sitting1,
    'Second Sitting': formData.sitting2 ? `${formData.sitting2.examType} (${formData.sitting2.examYear})` : 'None',
  });

  // --- Footer / Disclaimer ---
  page.drawRectangle({
    x: 50,
    y: 50,
    width: 500,
    height: 60,
    color: rgb(0.95, 0.95, 0.95),
  });

  drawText('Declaration:', 60, 90, 9, fontBold);
  drawText('I hereby certify that the information provided above is true and accurate.', 60, 75, 8);
  drawText(`Generated on: ${new Date().toLocaleString()}`, 60, 60, 8);

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}