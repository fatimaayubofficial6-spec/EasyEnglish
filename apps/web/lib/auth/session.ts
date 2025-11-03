import { getServerSession } from "next-auth/next";
import { authOptions } from "./config";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function getSession() {
  return await getServerSession(authOptions);
}
