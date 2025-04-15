import { v2 as cloudinary } from "cloudinary";
import { UploadApiResponse, UploadApiOptions } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFile = async (
  filePath: string,
  options: UploadApiOptions
): Promise<UploadApiResponse> => {
  try {
    return await cloudinary.uploader.upload(filePath, options);
  } finally {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
};
