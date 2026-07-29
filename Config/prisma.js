const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("SQL Database connected successfully");
  } catch (error) {
    console.error("SQL Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = {
  prisma,
  connectDB,
};