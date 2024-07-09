import { v2 as cloudinary } from "cloudinary";
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error("CLOUDINARY_CLOUD_NAME is not set");
}

if (!process.env.CLOUDINARY_API_KEY) {
  throw new Error("CLOUDINARY_API_KEY is not set");
}

if (!process.env.CLOUDINARY_API_SECRET) {
  throw new Error("CLOUDINARY_API_SECRET is not set");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(image: File) {
  const imageData = await image.arrayBuffer();
  const mime = image.type;
  const encoding = "base64";
  const base64Data = Buffer.from(imageData).toString("base64");
  const fileUri = "data:" + mime + ";" + encoding + "," + base64Data;
  try {
    const res = await cloudinary.uploader.upload(fileUri, {
      resource_type: "image",
      folder: "sleepat_img",
    });
    return { id: res.public_id, url: res.secure_url };
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function deleteImage(id: string) {
  try {
    await cloudinary.uploader.destroy(id, {
      resource_type: "image",
      invalidate: true,
    });
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function deleteImages(id: string[]) {
  try {
    await cloudinary.api.delete_resources(id, {
      invalidate: true,
    });
  } catch (error: any) {
    throw new Error(error);
  }
}
