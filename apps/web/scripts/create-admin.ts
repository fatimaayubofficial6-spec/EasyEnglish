import connectDB from "../lib/db/mongoose";
import AdminUser from "../lib/models/AdminUser";
import { AdminRole } from "../types/models";
import bcrypt from "bcryptjs";

async function createAdmin() {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL || "admin@easyenglish.com";
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const name = process.env.ADMIN_NAME || "Admin User";

    const existingAdmin = await AdminUser.findOne({ email });

    if (existingAdmin) {
      console.log(`Admin user with email ${email} already exists`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await AdminUser.create({
      email,
      hashedPassword,
      name,
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    });

    console.log("Admin user created successfully!");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Role:", admin.role);
    console.log("\nPlease change the password after first login.");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdmin();
