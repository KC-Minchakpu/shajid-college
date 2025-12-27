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

    await Applicant.findOneAndUpdate(
      { userId: (session.user as any).id },
      { 
        $set: {
          courseOfStudy: data.program,
          studyMode: data.mode,
          preferredCampus: data.campus,
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ message: "Program details updated" });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}