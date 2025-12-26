import { connectToDB } from '@/lib/mongodb';
import Applicant from '@/models/Applicant';
import { generatePDFAndSendEmail } from '@/utils/pdfHandler';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// 1. Refined Schema to match your Restructured Frontend Data
const fullApplicationSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(1),
    gender: z.string(),
    email: z.string().email(),
    phone: z.string().min(8),
    passportUrl: z.string().url().optional().or(z.string().length(0)),
    contactAddress: z.string().min(5),
    dateOfBirth: z.string(),
    parentsName: z.string(),
    parentsContactAddress: z.string(),
  }),

  healthInfo: z.object({
    bloodGroup: z.string().optional(),
    genotype: z.string().optional(),
    disability: z.string().optional(),
    chronicIllness: z.string().optional(),
    emergencyContact: z.string().optional(),
  }),

  schoolsAttended: z.object({
    primarySchool: z.string().min(1),
    secondarySchool: z.string().min(1),
    otherInstitutions: z.string().optional().or(z.string().length(0)),
  }),

  // Updated to allow the ExamSitting objects from Step 4
  examResults: z.array(z.any()).min(1), 

  programDetails: z.object({
    program: z.string(),
    mode: z.string(),
    campus: z.string(),
  }),

  utmeInfo: z.object({
    jambRegNo: z.string().min(6),
    jambScore: z.number().min(0).max(400),
    jambSubjects: z.array(z.string()).length(4),
  }),
});

export async function POST(req) {
  try {
    const { userId, fullForm } = await req.json();

    if (!userId || !fullForm) {
      return NextResponse.json({ error: 'Missing userId or form data' }, { status: 400 });
    }

    // 2. Validate with Zod
    const parsed = fullApplicationSchema.safeParse(fullForm);

    if (!parsed.success) {
      console.error('Zod Validation Error:', parsed.error.format());
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: parsed.error.flatten() 
      }, { status: 422 });
    }

    await connectToDB();

    // 3. Update or Create the Applicant record
    const updatedApplicant = await Applicant.findOneAndUpdate(
      { userId },
      {
        ...parsed.data,
        submitted: true,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // 4. Trigger Email (Optional: Don't block the response if email fails)
    try {
      await generatePDFAndSendEmail(userId, parsed.data);
    } catch (emailError) {
      console.error('Email/PDF Error (Non-fatal):', emailError);
      // We don't return an error here because the DB update was successful
    }

    return NextResponse.json({ 
      success: true, 
      applicantId: updatedApplicant._id 
    });

  } catch (err) {
    console.error('Final Submission Server Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}