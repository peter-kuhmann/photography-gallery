import { createId, init } from "@paralleldrive/cuid2";
import { getEnv } from "~/env";
import type { DbBase } from "~/infrastructure/database/schemas/DbBase";

export const generateDbId = init({ length: getEnv().DB_ID_LENGTH });

export function generateCreateData(): DbBase {
  const now = new Date().toISOString();

  return {
    id: generateDbId(),
    createdAt: now,
    updatedAt: now,
  };
}

export function generateUpdateData(): Pick<DbBase, "updatedAt"> {
  const now = new Date().toISOString();

  return {
    updatedAt: now,
  };
}
