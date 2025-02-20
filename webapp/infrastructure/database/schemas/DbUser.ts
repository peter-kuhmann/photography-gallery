import { z } from "zod";
import {
  DbBaseSchema,
  IdSchema,
} from "~/infrastructure/database/schemas/DbBase";

export const DbUserSchema = DbBaseSchema.extend({
  email: z.string().email(),
  hashedPassword: z.string().nonempty(),

  albums: z.array(IdSchema),
});

export type DbUser = z.infer<typeof DbUserSchema>;
