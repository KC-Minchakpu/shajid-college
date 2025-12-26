'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// import { db } from "@/lib/db"; // Uncomment when you have your DB set up

export async function saveStep1(formData: { firstName: string; lastName: string; phone: string; gender: string }) {
  const session = await getServerSession(authOptions);
  
  if (!session) throw new Error("Unauthorized");

  console.log("Saving data for user:", session.user.email, formData);

  // DB LOGIC EXAMPLE:
  // await db.application.upsert({
  //   where: { userId: session.user.id },
  //   update: { firstName: formData.firstName, lastName: formData.lastName, ... },
  //   create: { userId: session.user.id, firstName: formData.firstName, ... }
  // });

  return { success: true };
}