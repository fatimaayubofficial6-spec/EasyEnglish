import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin";
import connectDB from "@/lib/db/mongoose";
import AdminUser from "@/lib/models/AdminUser";

export async function GET() {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const admin = await AdminUser.findById(session.adminId).select("-hashedPassword").lean();

    if (!admin || !admin.isActive) {
      return NextResponse.json({ error: "Admin not found or inactive" }, { status: 404 });
    }

    return NextResponse.json({
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Get admin session error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
