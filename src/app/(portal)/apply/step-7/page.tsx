import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Your NextAuth configuration
import { redirect } from "next/navigation";
import ReviewAndPayClient from "./ReviewAndPayClient";
// import { db } from "@/lib/db"; // Your database connection

export default async function Step7Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Fetch the student's saved data from the database
  // const applicationData = await db.application.findUnique({
  //   where: { userId: session.user.id }
  // });

  // Dummy data for now - replace with your database call
  const applicationData = {
    firstName: "John",
    lastName: "Doe",
    utmeScore: 250,
    program: "Nursing Science",
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Step 7: Review & Finalize</h1>
      
      {/* 1. Review Section (Visual Summary) */}
      <div className="space-y-6 bg-white shadow rounded-lg p-6 mb-8">
        <section>
          <h3 className="font-bold border-b pb-2">Personal Information</h3>
          <p>Name: {applicationData.firstName} {applicationData.lastName}</p>
        </section>
        
        <section>
          <h3 className="font-bold border-b pb-2">Program & UTME</h3>
          <p>Applying for: {applicationData.program}</p>
          <p>UTME Score: {applicationData.utmeScore}</p>
        </section>
      </div>

      {/* 2. The Payment Client Component */}
      <ReviewAndPayClient 
        email={session.user.email as string} 
        amount={5000} 
      />
    </div>
  );
}