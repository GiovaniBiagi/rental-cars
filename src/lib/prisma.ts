import { PrismaClient } from "@prisma/client";
import { envs } from "../envs";

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: envs.DATABASE_URL,
    },
  },
  log: ["query"],
});
