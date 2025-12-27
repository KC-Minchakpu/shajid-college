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

    const updatedApplicant = await Applicant.findOneAndUpdate(
      { userId: (session.user as any).id },
      { 
        $set: {
          healthInfo: {
            chronicIllness: data.chronicIllness,
            bloodGroup: data.bloodGroup,
            genotype: data.genotype,
            emergencyContact: data.emergencyContact,
            
          }
        }
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: "Health info saved successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}