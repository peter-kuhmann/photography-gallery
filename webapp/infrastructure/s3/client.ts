import { S3Client } from "bun";
import { getEnv } from "~/env";

let client: S3Client | null = null;

export function getS3Client() {
	if (!client) {
		client = new S3Client({
			accessKeyId: getEnv().S3_BUCKET_ACCESS_KEY,
			secretAccessKey: getEnv().S3_BUCKET_SECRET,
			bucket: getEnv().S3_BUCKET_NAME,
			endpoint: getEnv().S3_BUCKET_ENDPOINT,
		});
	}

	return client;
}
