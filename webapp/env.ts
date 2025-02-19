import { z } from "zod";

const EnvSchema = z.object({
  REDIS_URL: z.string().url().startsWith("rediss://"),

  SEED_USER_EMAIL: z.string().email(),
  SEED_USER_PASSWORD: z.string().min(1),
  SEED_IMAGES_DIRECTORY: z.string().optional(),

  NUXT_SESSION_PASSWORD: z.string().min(32),

  DB_ID_LENGTH: z.coerce.number().default(24),
  S3_OBJECT_KEY_LENGTH: z.coerce.number().default(32),
  PASSWORD_HASH_SALT_ROUNDS: z.coerce.number().default(12),

  S3_BUCKET_ACCESS_KEY: z.string().nonempty(),
  S3_BUCKET_SECRET: z.string().nonempty(),
  S3_BUCKET_NAME: z.string().nonempty(),
  S3_BUCKET_ENDPOINT: z.string().nonempty(),
});

export function getEnv(): z.infer<typeof EnvSchema> {
  return EnvSchema.parse(process.env);
}
