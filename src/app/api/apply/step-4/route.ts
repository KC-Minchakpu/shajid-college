import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Applicant from "@/models/Applicant";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data } = await req.json();
    await dbConnect();

    // Prepare the array for MongoDB
    const examResultsArray = [];
    
    // Process Sitting 1
    if (data.sitting1) {
      examResultsArray.push({
        examType: data.sitting1.examType,
        examYear: data.sitting1.examYear,
        examNumber: data.sitting1.examNumber,
        subjects: data.sitting1.subjects.filter((s: any) => s.subject && s.grade)
      });
    }

    // Process Sitting 2 (if it exists)
    if (data.sitting2 && data.sitting2.examNumber) {
      examResultsArray.push({
        examType: data.sitting2.examType,
        examYear: data.sitting2.examYear,
        examNumber: data.sitting2.examNumber,
        subjects: data.sitting2.subjects.filter((s: any) => s.subject && s.grade)
      });
    }

    await Applicant.findOneAndUpdate(
      { userId: (session.user as any).id },
      { $set: { examResults: examResultsArray } },
      { upsert: true }
    );

    return NextResponse.json({ message: "Results saved successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}