import { v2 as cloudinary } from "cloudinary";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file: Express.Multer.File) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "profile_pictures",
        public_id: file.originalname,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url);
      }
    );

    uploadStream.end(file.buffer);
  });
};
