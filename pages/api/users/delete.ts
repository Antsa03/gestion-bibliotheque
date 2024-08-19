import prisma from "@/lib/prisma-client";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "DELETE")
      return res.status(401).json("Méthode non autorisé");
    const { id } = req.body;

    // Récupérer les détails de l'utilisateur, y compris les chemins de fichiers
    const user = await prisma.user.findUnique({
      where: { user_id: id },
    });

    if (!user) {
      return res.status(404).json({ error: "user non trouvé" });
    }

    // Définir les chemins des fichiers
    const profilePath = user.profile
      ? path.join(process.cwd(), "uploads", "users", "profiles", user.profile)
      : null;

    // Supprimer les fichiers si ils existent
    if (
      profilePath &&
      fs.existsSync(profilePath) &&
      user.profile !== "user.png"
    ) {
      fs.unlinkSync(profilePath);
    }

    const delete_user = await prisma.user.delete({
      where: { user_id: id },
    });
    return res.status(200).json(delete_user);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
