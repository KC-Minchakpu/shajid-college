import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import nodemailer from 'nodemailer';

export async function generatePDFAndSendEmail(userId, data) {
  try {
    // --- 1. GENERATE THE PDF ---
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Header logic
    page.drawRectangle({ x: 0, y: 720, width: 600, height: 80, color: rgb(0.05, 0.2, 0.5) });
    page.drawText('SHAGID ROYAL COLLEGE OF NURSING & MIDWIFERY', { x: 50, y: 760, size: 20, font: fontBold, color: rgb(1, 1, 1) });
    page.drawText('OFFICIAL ADMISSION APPLICATION SLIP', { x: 50, y: 740, size: 10, font: fontRegular, color: rgb(1, 1, 1) });

    // Section Helper
    let y = 680;
    const addField = (label, value) => {
      page.drawText(`${label}:`, { x: 50, y, size: 10, font: fontBold });
      page.drawText(String(value || 'N/A'), { x: 200, y, size: 10, font: fontRegular });
      y -= 20;
    };

    page.drawText('PERSONAL DETAILS', { x: 50, y, size: 12, font: fontBold, color: rgb(0.05, 0.2, 0.5) });
    y -= 20;
    addField('Full Name', data.personalInfo.fullName);
    addField('Email', data.personalInfo.email);
    addField('Phone', data.personalInfo.phone);
    y -= 20;

    page.drawText('ACADEMIC DETAILS', { x: 50, y, size: 12, font: fontBold, color: rgb(0.05, 0.2, 0.5) });
    y -= 20;
    addField('Program', data.programDetails.program);
    addField('JAMB Reg No', data.utmeInfo.jambRegNo);
    addField('JAMB Score', data.utmeInfo.jambScore);

    const pdfBytes = await pdfDoc.save();

    // --- 2. CONFIGURE EMAIL TRANSPORT ---
    // Note: Use environment variables for security!
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, // Use an "App Password" for Gmail
      },
    });

    // --- 3. SEND THE EMAIL ---
    const mailOptions = {
      from: '"Shagid Nursing Portal" <no-reply@shagidcollege.edu.ng>',
      to: data.personalInfo.email,
      subject: 'Application Submitted Successfully - Shagid College',
      text: `Hello ${data.personalInfo.fullName}, your application has been received. Please find your registration slip attached.`,
      attachments: [
        {
          filename: `Application_Slip_${data.utmeInfo.jambRegNo}.pdf`,
          content: Buffer.from(pdfBytes),
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${data.personalInfo.email}`);

    return true;
  } catch (error) {
    console.error('PDF/Email Error:', error);
    throw error;
  }
}