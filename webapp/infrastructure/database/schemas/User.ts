import {z} from "zod";
import {BaseSchema, IdSchema} from "~/infrastructure/database/schemas/Base";

export const DbUserSchema = BaseSchema.extend({
    email: z.string().email(),
    hashedPassword: z.string().nonempty(),

    albums: z.array(IdSchema)
})

export type DbUser = z.infer<typeof DbUserSchema>
