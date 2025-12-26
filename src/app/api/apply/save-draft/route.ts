import { connectToDB } from '@/lib/mongodb';
import Applicant from '@/models/Applicant';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId, fullForm } = await req.json();
    await connectToDB();

    await Applicant.findOneAndUpdate(
      { userId },
      { ...fullForm, submitted: false }, // Explicitly set submitted to false
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 });
  }
}