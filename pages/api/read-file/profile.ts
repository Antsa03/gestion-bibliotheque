import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import mime from "mime-types"; // Utiliser la bibliothèque mime-types

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { filename } = req.query;

  // Spécifier le répertoire où les images sont stockées
  const filePath = path.join(
    process.cwd(),
    "uploads",
    "users",
    "profiles",
    filename as string
  );

  if (fs.existsSync(filePath)) {
    const mimeType = mime.lookup(filePath); // Déterminer le type MIME du fichier

    if (mimeType) {
      res.setHeader("Content-Type", mimeType);
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.status(400).json({ error: "Unsupported file type" });
    }
  } else {
    res.status(404).json({ error: "File not found" });
  }
}
