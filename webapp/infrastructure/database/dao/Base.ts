import {createId, init} from "@paralleldrive/cuid2";
import type {Base} from "~/infrastructure/database/schemas/Base";
import {getEnv} from "~/env";

export const generateDbId = init({ length: getEnv().DB_ID_LENGTH })

export function generateCreateData() : Base {
    const now = new Date().toISOString();

    return {
        id: generateDbId(),
        createdAt: now,
        updatedAt: now
    }
}


export function generateUpdateData() : Pick<Base, "updatedAt"> {
    const now = new Date().toISOString();

    return {
        updatedAt: now
    }
}
