import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateStyledPDF(formData: any) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();
  
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Helper to draw text
  const drawText = (text: string, x: number, y: number, size = 10, font = fontRegular) => {
    page.drawText(text || 'N/A', { x, y, size, font, color: rgb(0, 0, 0) });
  };

  // --- 1. Header (Professional Blue) ---
  page.drawRectangle({
    x: 0, y: height - 100,
    width: width, height: 100,
    color: rgb(0.05, 0.2, 0.5),
  });

  page.drawText('SCHOOL OF NURSING & MIDWIFERY', {
    x: 50, y: height - 45, size: 22, font: fontBold, color: rgb(1, 1, 1),
  });
  page.drawText('OFFICIAL ONLINE APPLICATION SUMMARY', {
    x: 50, y: height - 70, size: 12, font: fontRegular, color: rgb(0.9, 0.9, 0.9),
  });

  // --- 2. Handle Passport Photo ---
  // If we have a passport preview URL (base64 or blob), we embed it
  if (formData.passportPreview) {
    try {
      const response = await fetch(formData.passportPreview);
      const imageBytes = await response.arrayBuffer();
      const isPng = formData.passportPreview.includes('image/png');
      const embeddedImage = isPng 
        ? await pdfDoc.embedPng(imageBytes) 
        : await pdfDoc.embedJpg(imageBytes);

      // Draw photo in top right
      page.drawImage(embeddedImage, {
        x: width - 150,
        y: height - 210,
        width: 100,
        height: 120,
      });
      // Photo Border
      page.drawRectangle({
        x: width - 150, y: height - 210,
        width: 100, height: 120,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
    } catch (e) {
      console.error("Could not embed passport photo", e);
    }
  }

  // --- 3. Content Sections ---
  let currentY = height - 140;

  const drawSection = (title: string, data: Record<string, any>) => {
    // Section Header
    page.drawRectangle({ x: 50, y: currentY - 5, width: 350, height: 18, color: rgb(0.9, 0.9, 0.9) });
    drawText(title.toUpperCase(), 55, currentY, 11, fontBold);
    currentY -= 30;

    Object.entries(data).forEach(([key, value]) => {
      drawText(`${key}:`, 60, currentY, 10, fontBold);
      drawText(String(value), 180, currentY, 10, fontRegular);
      currentY -= 18;
    });
    currentY -= 15;
  };

  // 1. Personal Info
  drawSection('Applicant Details', {
    'Full Name': formData.fullName,
    'Gender': formData.gender,
    'Phone Number': formData.phone,
    'State of Origin': formData.state || 'N/A',
  });

  // 2. Academic Choice
  drawSection('Academic Choice', {
    'Program': formData.program,
    'Study Mode': formData.mode,
    'Campus': formData.campus,
  });

  // 3. UTME/JAMB Details
  drawSection('UTME Information', {
    'JAMB Reg No': formData.jambRegNo,
    'JAMB Score': formData.jambScore,
    'Subject Set': formData.jambSubjects?.join(', '),
  });

  // 4. Examination History
  drawSection('Exam Sittings', {
    'First Sitting': formData.sitting1 ? `${formData.sitting1.examType} (${formData.sitting1.examYear})` : 'N/A',
    'Second Sitting': formData.sitting2 ? `${formData.sitting2.examType} (${formData.sitting2.examYear})` : 'None Provided',
  });

  // --- 4. Bottom: Ref Number & Barcode Placeholder ---
  const appID = `APP-${Math.floor(100000 + Math.random() * 900000)}`;
  
  page.drawRectangle({ x: 50, y: 50, width: 500, height: 80, color: rgb(0.98, 0.98, 0.98), borderColor: rgb(0.8, 0.8, 0.8), borderWidth: 1 });
  drawText('APPLICATION ID:', 70, 100, 12, fontBold);
  page.drawText(appID, { x: 180, y: 100, size: 14, font: fontBold, color: rgb(0.1, 0.4, 0.1) });

  drawText('Note: Present this slip at the examination venue for verification.', 70, 80, 9, fontRegular);
  drawText(`Print Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 70, 65, 8);

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}