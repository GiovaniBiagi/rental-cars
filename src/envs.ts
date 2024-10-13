// env.ts
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().min(1000),
  API_VERSION: z.string().default("v1"),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  ENV: z
    .union([
      z.literal("development"),
      z.literal("testing"),
      z.literal("production"),
    ])
    .default("development"),
});

export const envs = envSchema.parse(process.env);
