import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: (_req, file) => {
    const filename = file.originalname;

    return {
      folder: "profile_pictures",
      allowed_formats: ["jpeg", "png", "jpg"],
      public_id: filename,
    };
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20000000,
  },
});
