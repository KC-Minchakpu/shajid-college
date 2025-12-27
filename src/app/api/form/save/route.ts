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

    const { step, data } = await req.json();
    await dbConnect();

    const userId = (session.user as any).id;
    let updateQuery = {};

    // Determine which part of the Applicant model to update based on the step
    switch (step) {
      case 1:
        updateQuery = {
          personalInfo: {
            fullName: data.fullName,
            gender: data.gender,
            email: data.email,
            phone: data.phone,
            contactAddress: data.contactAddress,
            dateOfBirth: data.dateOfBirth,
            parentsName: data.parentsName,
            passportUrl: data.passportPreview, 
          },
        };
        break;

      case 2:
        updateQuery = {
          healthInfo: {
            bloodGroup: data.bloodGroup,
            genotype: data.genotype,
            disability: data.disability,
            chronicIllness: data.chronicIllness,
            emergencyContact: data.emergencyContact,
          },
        };
        break;

      // Add cases for Step 3, 4, etc. as you paste them
      default:
        return NextResponse.json({ error: "Invalid step" }, { status: 400 });
    }

    const updatedApplicant = await Applicant.findOneAndUpdate(
      { userId },
      { $set: updateQuery },
      { upsert: true, new: true }
    );

    return NextResponse.json({ 
      message: `Step ${step} saved successfully`,
      applicant: updatedApplicant 
    });

  } catch (error) {
    console.error("API Save Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}