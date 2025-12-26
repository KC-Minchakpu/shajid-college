import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create a unique filename to prevent overwriting
    const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");
    
    // Define the path to save the file
    const uploadDir = path.join(process.cwd(), "public/uploads/passports");
    
    // Ensure directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);

    // Write the file to the public folder
    await writeFile(filePath, buffer);

    // Return the URL that the browser can use to see the image
    const publicUrl = `/uploads/passports/${filename}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Error occurred ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
}