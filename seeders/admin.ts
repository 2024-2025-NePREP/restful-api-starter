import { PrismaClient, UserRole } from "@prisma/client";
import dotenv from "dotenv";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../constants/envVars";
import bcrypt from "bcrypt";
dotenv.config();

const prisma = new PrismaClient();

export const seedAdminUser = async () => {
  try {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD is missing in .env");
    }

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (existingAdmin) {
      console.log("Admin user already exists.");
      return;
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);

    // Create admin user
    await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        name: "Admin",
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    });

    console.log("Admin created successfully.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error seeding admin user:", error.message);
      throw error; // Or handle gracefully
    }
  } finally {
    await prisma.$disconnect(); // Close the Prisma connection
  }
};
