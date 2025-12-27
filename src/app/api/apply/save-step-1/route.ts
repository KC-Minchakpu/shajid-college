import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Applicant from "@/models/Applicant"; 
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { formData } = await req.json();
    await dbConnect();

    // Use "findOneAndUpdate" with "upsert: true"
    // This creates the record if it doesn't exist, or updates it if it does
    const updatedApplicant = await Applicant.findOneAndUpdate(
      { userId: (session.user as any).id },
      {
        $set: {
          "personalInfo.fullName": formData.firstName + " " + formData.lastName,
          "personalInfo.phone": formData.phone,
          "personalInfo.dateOfBirth": formData.dateOfBirth,
          "personalInfo.gender": formData.gender,
          "personalInfo.contactAddress": formData.address,
          "personalInfo.email": session.user.email, 
        },
      },
      { new: true, upsert: true } 
    );

    return NextResponse.json({ message: "Personal info saved" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}