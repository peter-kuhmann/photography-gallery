import {z} from "zod";

export const IdSchema = z.string().cuid2()

export const BaseSchema = z.object({
    id: IdSchema,

    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
})

export type Base = z.infer<typeof BaseSchema>

export type CreateInputData<T> = Omit<T, keyof Base>

export type UpdateInputData<T> = Partial<Omit<T, keyof Base>>
