/**
 * @jest-environment node
 */

import { hashPassword, verifyPassword, createAdminSession, verifyAdminSession } from "@/lib/auth/admin";

describe("Admin Authentication", () => {
  describe("Password hashing", () => {
    it("should hash passwords", async () => {
      const password = "test123";
      const hashed = await hashPassword(password);
      
      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);
      expect(hashed.length).toBeGreaterThan(10);
    });

    it("should verify correct passwords", async () => {
      const password = "test123";
      const hashed = await hashPassword(password);
      const isValid = await verifyPassword(password, hashed);
      
      expect(isValid).toBe(true);
    });

    it("should reject incorrect passwords", async () => {
      const password = "test123";
      const hashed = await hashPassword(password);
      const isValid = await verifyPassword("wrong", hashed);
      
      expect(isValid).toBe(false);
    });
  });

  describe("JWT tokens", () => {
    it("should create admin session token", async () => {
      const admin = {
        _id: "123456789012345678901234",
        email: "admin@test.com",
        role: "super_admin",
        name: "Test Admin",
      } as any;

      const token = await createAdminSession(admin);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(10);
    });

    it("should verify valid session token", async () => {
      const admin = {
        _id: "123456789012345678901234",
        email: "admin@test.com",
        role: "super_admin",
        name: "Test Admin",
      } as any;

      const token = await createAdminSession(admin);
      const session = await verifyAdminSession(token);
      
      expect(session).toBeDefined();
      expect(session?.email).toBe("admin@test.com");
      expect(session?.role).toBe("super_admin");
    });

    it("should reject invalid token", async () => {
      const session = await verifyAdminSession("invalid-token");
      
      expect(session).toBeNull();
    });
  });
});
