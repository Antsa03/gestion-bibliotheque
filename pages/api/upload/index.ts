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
const couvertureDir = path.join(
  process.cwd(),
  "uploads",
  "livres",
  "couvertures"
);
const fichiersDir = path.join(process.cwd(), "uploads", "livres", "fichiers");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Create directories if they don't exist
    await fs.promises.mkdir(couvertureDir, { recursive: true });
    await fs.promises.mkdir(fichiersDir, { recursive: true });

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

      // Handle couverture file
      const couvertureFileArray = files.couverture as File[];
      let couvertureFileName: string | null = null;

      if (couvertureFileArray && couvertureFileArray.length > 0) {
        couvertureFileName = couvertureFileArray[0].newFilename;
        const couvertureFilePath = path.join(couvertureDir, couvertureFileName);
        fs.promises.rename(couvertureFileArray[0].filepath, couvertureFilePath); // Move the file
      }

      // Handle livre_numerique file
      const livreNumeriqueFileArray = files.livre_numerique as File[];
      let livreNumeriqueFileName: string | null = null;

      if (livreNumeriqueFileArray && livreNumeriqueFileArray.length > 0) {
        livreNumeriqueFileName = livreNumeriqueFileArray[0].newFilename;
        const livreNumeriqueFilePath = path.join(
          fichiersDir,
          livreNumeriqueFileName
        );
        fs.promises.rename(
          livreNumeriqueFileArray[0].filepath,
          livreNumeriqueFilePath
        ); // Move the file
      }

      // Return just the filenames in the response
      return res.status(200).json({
        couvertureFileName,
        livreNumeriqueFileName,
      });
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export default handler;
