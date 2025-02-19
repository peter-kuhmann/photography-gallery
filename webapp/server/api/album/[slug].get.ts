import { z } from "zod";
import { getAlbumBySlug } from "~/infrastructure/database/dao/Album";
import { getAlbumPictureById } from "~/infrastructure/database/dao/AlbumPicture";
import { getS3Client } from "~/infrastructure/s3/client";

export default defineEventHandler(async (event) => {
  const routeParams = await getValidatedRouterParams(
    event,
    z.object({
      slug: z.string().nonempty(),
    }).parse,
  );

  const queryParams = await getValidatedQuery(
    event,
    z.object({
      password: z.string().nonempty().optional(),
    }).parse,
  );

  const album = await getAlbumBySlug(routeParams.slug);

  if (!album) {
    return {
      success: false,
      reason: "NOT_FOUND",
    } as const;
  }

  const cookiePasswordName = `album_password_${album.id}`;
  const cookiePasswordValue = getCookie(event, cookiePasswordName);

  if (album.access.type !== "PUBLIC") {
    if (album.access.type === "PASSWORD_PROTECTED") {
      const passwordToCheckAgainst =
        cookiePasswordValue || queryParams.password;

      if (!passwordToCheckAgainst) {
        return {
          success: false,
          reason: "NOT_AUTHORIZED",
          invalidPassword: false,
        } as const;
      }

      if (album.access.password !== passwordToCheckAgainst) {
        return {
          success: false,
          reason: "NOT_AUTHORIZED",
          invalidPassword: true,
        } as const;
      }

      if (queryParams.password && !cookiePasswordValue) {
        setCookie(event, cookiePasswordName, queryParams.password, {
          maxAge: 60 * 60 * 24, // 24 hours
          httpOnly: true,
          sameSite: "strict",
          path: "/",
        });
      }
    } else {
      const _exhaustiveCheck: never = album.access;
      throw createError({ statusCode: 500 });
    }
  }

  return {
    success: true,
    album,
    pictures:
      album &&
      (
        await Promise.all(
          album.pictures.map(async (pictureId) => {
            const albumPicture = await getAlbumPictureById(pictureId);

            if (!albumPicture) {
              throw new Error(
                `AlbumPicture with id ${pictureId} could not be found.`,
              );
            }

            const presignedFileUrl = getS3Client()
              .file(albumPicture.originalImage.s3ObjectKey)
              .presign({
                expiresIn: 3600,
                type: albumPicture.originalImage.mimeType,
              });

            const presignedFileUrlOptimizedImage = getS3Client()
              .file(albumPicture.optimizedImage.s3ObjectKey)
              .presign({
                expiresIn: 3600,
                type: albumPicture.optimizedImage.mimeType,
              });

            return {
              ...albumPicture,
              presignedS3Url: presignedFileUrl,
              presignedS3UrlOptimizedImage: presignedFileUrlOptimizedImage,
            };
          }),
        )
      ).sort(
        (a, b) => album.pictures.indexOf(a.id) - album.pictures.indexOf(b.id),
      ),
  } as const;
});
