import { z } from "zod";

export const IdSchema = z.string().cuid2();

export const DbBaseSchema = z.object({
  id: IdSchema,

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type DbBase = z.infer<typeof DbBaseSchema>;

export type CreateInputData<T> = Omit<T, keyof DbBase>;

export type UpdateInputData<T> = Partial<Omit<T, keyof DbBase>>;
