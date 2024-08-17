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
      return res.status(401).json("Méthode non autorisée");

    const { id } = req.body;

    // Récupérer les détails du livre, y compris les chemins de fichiers
    const livre = await prisma.livre.findUnique({
      where: { livre_id: id },
      include: {
        proprietaire: true,
        auteur: true,
      },
    });

    if (!livre) {
      return res.status(404).json({ error: "Livre non trouvé" });
    }

    // Définir les chemins des fichiers
    const couverturePath = livre.couverture
      ? path.join(
          process.cwd(),
          "uploads",
          "livres",
          "couvertures",
          livre.couverture
        )
      : null;

    const livreNumeriquePath = livre.livre_numerique
      ? path.join(
          process.cwd(),
          "uploads",
          "livres",
          "fichiers",
          livre.livre_numerique
        )
      : null;

    // Supprimer les fichiers si ils existent
    if (couverturePath && fs.existsSync(couverturePath)) {
      fs.unlinkSync(couverturePath);
    }

    if (livreNumeriquePath && fs.existsSync(livreNumeriquePath)) {
      fs.unlinkSync(livreNumeriquePath);
    }

    // Supprimer le livre de la base de données
    const delete_livre = await prisma.livre.delete({
      where: { livre_id: id },
      include: {
        proprietaire: true,
        auteur: true,
      },
    });

    return res.status(200).json(delete_livre);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
