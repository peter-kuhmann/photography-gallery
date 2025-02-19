import { readdir } from "node:fs/promises";
import sharp from "sharp";
import { getEnv } from "~/env";
import { createAlbum, updateAlbum } from "~/infrastructure/database/dao/Album";
import { createAlbumPicture } from "~/infrastructure/database/dao/AlbumPicture";
import {
  createUser,
  getUserByEmail,
  updateUser,
} from "~/infrastructure/database/dao/User";
import { getDb } from "~/infrastructure/database/db";
import { getS3Client } from "~/infrastructure/s3/client";
import { S3_DIRECTORIES } from "~/infrastructure/s3/constants";
import { generateS3ObjectId } from "~/utils/ids";
import { hashPassword } from "~/utils/password";

async function main() {
  await getDb().flushall();

  let user = await createUser({
    email: getEnv().SEED_USER_EMAIL,
    hashedPassword: await hashPassword(getEnv().SEED_USER_PASSWORD),
    albums: [],
  });

  let album = await createAlbum({
    enabled: true,
    access: { type: "PUBLIC" },
    slug: "test_album_1",
    title: "Test Album 1",
    ownerUserId: user.id,
    pictures: [],
  });

  let album2 = await createAlbum({
    enabled: true,
    access: { type: "PASSWORD_PROTECTED", password: "yellow42" },
    slug: "test_album_2",
    title: "Test Album 2",
    ownerUserId: user.id,
    pictures: [],
  });

  user = await updateUser(user, {
    albums: [album.id],
  });

  const seedImagesDir = getEnv().SEED_IMAGES_DIRECTORY;
  if (seedImagesDir) {
    const fileNames = (await readdir(`${import.meta.dir}/${seedImagesDir}`))
      .filter(
        (file) =>
          file.endsWith(".jpg") ||
          file.endsWith(".jepg") ||
          file.endsWith(".png"),
      )
      .sort();

    for (const fileName of fileNames) {
      console.log(`Uploading image: ${fileName}`);
      const inputFile = Bun.file(
        `${import.meta.dir}/${seedImagesDir}/${fileName}`,
      );

      const s3ObjectKey =
        S3_DIRECTORIES.albumPictures.prefix + generateS3ObjectId();
      const s3File = getS3Client().file(s3ObjectKey);
      await s3File.write(await inputFile.arrayBuffer(), {
        type: inputFile.type,
      });

      const sharpImage = sharp(await inputFile.arrayBuffer());
      const imageMetadata = await sharpImage.metadata();
      if (!imageMetadata) {
        throw new Error("metadata error");
      }

      const maxDimension = 1200;

      // Ensure that the aspect ratio is preserved
      const resizeOptions = {
        width: Math.min(imageMetadata.width ?? maxDimension, maxDimension),
        height: Math.min(imageMetadata.height ?? maxDimension, maxDimension),
        fit: sharp.fit.inside, // Ensures the image fits within the max dimensions
        withoutEnlargement: true, // Prevents enlarging images smaller than the max dimensions
      };

      const { data: optimizedImage, info: optimizedImageInfo } =
        await sharpImage
          .resize(resizeOptions)
          .webp({ quality: 70 })
          .toBuffer({ resolveWithObject: true });

      const s3ObjectKeyOptimizedImage = `${s3ObjectKey}_optimized`;
      const s3FileOptimizedImage = getS3Client().file(
        s3ObjectKeyOptimizedImage,
      );
      await s3FileOptimizedImage.write(optimizedImage, {
        type: "image/webp",
      });

      const albumPicture = await createAlbumPicture({
        owningAlbumId: album.id,
        filename: fileName,
        originalImage: {
          s3ObjectKey: s3ObjectKey,
          bytes: inputFile.size,
          mimeType: inputFile.type,
          height: imageMetadata.height!,
          width: imageMetadata.width!,
        },
        optimizedImage: {
          s3ObjectKey: s3ObjectKeyOptimizedImage,
          bytes: optimizedImageInfo.size,
          mimeType: "image/webp",
          width: optimizedImageInfo.width,
          height: optimizedImageInfo.height,
        },
      });

      album = await updateAlbum(album, {
        pictures: [...album.pictures, albumPicture.id],
      });

      album2 = await updateAlbum(album2, {
        pictures: [...album2.pictures, albumPicture.id],
      });

      console.log("... done ✅");
    }
  }
}

try {
  await main();
} finally {
  getDb().disconnect();
}
