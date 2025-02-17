import {z} from "zod";
import {getAlbumBySlug} from "~/infrastructure/database/dao/Album";
import {getAlbumPictureById} from "~/infrastructure/database/dao/AlbumPicture";
import {getS3Client} from "~/infrastructure/s3/client";

export default defineEventHandler(async (event) => {
    const params = await getValidatedRouterParams(event, z.object({
        slug: z.string().nonempty(),
    }).parse);

    const album = await getAlbumBySlug(params.slug);

    return {
        album,
        pictures: album && await Promise.all(
            album.pictures.map(async (pictureId) => {
                const albumPicture = await getAlbumPictureById(pictureId)

                if (!albumPicture) {
                    throw new Error(`AlbumPicture with id ${pictureId} could not be found.`)
                }

                const presignedFileUrl = getS3Client().file(albumPicture.originalImage.s3ObjectKey).presign({
                    expiresIn: 3600,
                    type: albumPicture.originalImage.mimeType
                });

                const presignedFileUrlOptimizedImage = getS3Client().file(albumPicture.optimizedImage.s3ObjectKey).presign({
                    expiresIn: 3600,
                    type: albumPicture.optimizedImage.mimeType
                });

                return {
                    ...albumPicture,
                    presignedS3Url: presignedFileUrl,
                    presignedS3UrlOptimizedImage: presignedFileUrlOptimizedImage
                }
            })
        )
    }
})
