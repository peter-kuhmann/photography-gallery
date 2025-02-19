import { init } from "@paralleldrive/cuid2";
import { getEnv } from "~/env";

export const generateS3ObjectId = init({
	length: getEnv().S3_OBJECT_KEY_LENGTH,
});
