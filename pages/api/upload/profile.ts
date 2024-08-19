import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File, Fields, Files } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Define directories for storing files
const profileDir = path.join(process.cwd(), "uploads", "users", "profiles");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Create directories if they don't exist
    await fs.promises.mkdir(profileDir, { recursive: true });

    const form = formidable({
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB
      filename: (name, ext, part) => {
        return Date.now().toString() + "_" + part.originalFilename;
      },
    });

    form.parse(req, (err: Error, fields: Fields, files: Files) => {
      if (err) {
        return res.status(500).json({ error: "Error parsing files" });
      }

      // Handle profile file
      const profileFileArray = files.profile as File[];
      let profileFileName: string | null = null;

      if (profileFileArray && profileFileArray.length > 0) {
        profileFileName = profileFileArray[0].newFilename;
        const profileFilePath = path.join(profileDir, profileFileName);
        fs.promises.rename(profileFileArray[0].filepath, profileFilePath); // Move the file
      }

      // Return just the filenames in the response
      return res.status(200).json({
        profileFileName,
      });
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export default handler;
