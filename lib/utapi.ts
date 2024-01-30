"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export const deleteFile = async (key: string) => {
  try {
    await utapi.deleteFiles(key);
  } catch (error) {
    console.log(error);
    throw new Error("unable to remove image");
  }
};
