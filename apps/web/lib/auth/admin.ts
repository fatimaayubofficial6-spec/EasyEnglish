import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db/mongoose";
import AdminUser from "@/lib/models/AdminUser";
import { IAdminUser } from "@/types/models";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "your-secret-key-change-in-production"
);
const COOKIE_NAME = "admin-session";

export interface AdminSession {
  adminId: string;
  email: string;
  role: string;
  name?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createAdminSession(admin: IAdminUser): Promise<string> {
  const token = await new SignJWT({
    adminId: admin._id.toString(),
    email: admin.email,
    role: admin.role,
    name: admin.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);

  return token;
}

export async function verifyAdminSession(token: string): Promise<AdminSession | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as AdminSession;
  } catch (error) {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifyAdminSession(token);
}

export async function setAdminSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function authenticateAdmin(
  email: string,
  password: string
): Promise<IAdminUser | null> {
  await connectDB();

  const admin = await AdminUser.findOne({ email: email.toLowerCase(), isActive: true });

  if (!admin) {
    return null;
  }

  const isValid = await verifyPassword(password, admin.hashedPassword);

  if (!isValid) {
    return null;
  }

  return admin;
}

export async function requireAdminAuth(): Promise<AdminSession> {
  const session = await getAdminSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}
