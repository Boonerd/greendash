
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Here you would typically save to Firebase or a database.
    // For now, we simulate a server delay and success.
    console.log("Backend received profile update:", data);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ 
      success: true, 
      message: "Profile updated successfully",
      data: data 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Simulate fetching user data
  return NextResponse.json({
    name: "Farmer Sarah",
    phone: "+254 712 345 678",
    county: "Kiambu",
    farmSize: "2.5",
    crops: ["Coffee", "Maize"]
  });
}
