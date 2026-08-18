import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

/*
|--------------------------------------------------------------------------
| Cloudinary Configuration
|--------------------------------------------------------------------------
*/


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



/*
|--------------------------------------------------------------------------
| Upload Image
|--------------------------------------------------------------------------
*/

export const uploadImage = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "Cooking_Buddy/recipes",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(
            new Error(`Cloudinary Upload Failed: ${error.message}`)
          );
        }

        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/*
|--------------------------------------------------------------------------
| Delete Image
|--------------------------------------------------------------------------
*/

export const deleteImage = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Cloudinary Delete Failed: ${error.message}`);
  }
};

/*
|--------------------------------------------------------------------------
| Features Used
|--------------------------------------------------------------------------
| ✓ Cloudinary Configuration
| ✓ Upload Stream
| ✓ Streamifier
| ✓ Promises
| ✓ Async/Await
| ✓ Error Handling
|--------------------------------------------------------------------------
*/