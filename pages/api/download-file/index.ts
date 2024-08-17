import path from "path";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { fileName } = req.query;

  if (typeof fileName !== "string") {
    return res.status(400).json({ error: "File name is required" });
  }

  const filePath = path.join(
    process.cwd(),
    "uploads/livres/fichiers",
    fileName
  );

  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    return res.status(404).json({ error: "File not found" });
  }
}
