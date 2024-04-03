import { ID, storage } from "@/Utils/appwriteConfig";

export const imageUpload = async (file: File) => {
  if (!file) return;
  const fileUploaded = await storage.createFile(
    process.env.NEXT_PUBLIC_BUCKET_ID!,
    ID.unique(),
    file
  );
  return fileUploaded;
};
