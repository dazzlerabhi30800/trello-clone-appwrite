import { storage } from "@/Utils/appwriteConfig";
import { Image } from "@/type";

export const getUrlImage = async (file: Image) => {
  if (!file) return;
  const url = storage.getFilePreview(file.bucketId, file.fileId);
  return url.toString();
};
