import prisma from "@/lib/prisma-client";
import { Livre } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "PUT")
      return res.status(401).json("Méthode non autorisée");

    const livre: Livre = req.body;

    // Récupérer les détails actuels du livre
    const existingLivre = await prisma.livre.findUnique({
      where: { livre_id: livre.livre_id },
    });

    if (!existingLivre) {
      return res.status(404).json({ error: "Livre non trouvé" });
    }

    // Définir les chemins des anciens fichiers
    const oldCouverturePath = existingLivre.couverture
      ? path.join(
          process.cwd(),
          "uploads",
          "livres",
          "couvertures",
          existingLivre.couverture
        )
      : null;

    const oldLivreNumeriquePath = existingLivre.livre_numerique
      ? path.join(
          process.cwd(),
          "uploads",
          "livres",
          "fichiers",
          existingLivre.livre_numerique
        )
      : null;

    // Supprimer les anciens fichiers si de nouveaux fichiers sont fournis
    if (
      livre.couverture &&
      livre.couverture !== existingLivre.couverture &&
      oldCouverturePath &&
      fs.existsSync(oldCouverturePath)
    ) {
      fs.unlinkSync(oldCouverturePath);
    }

    if (
      livre.livre_numerique &&
      livre.livre_numerique !== existingLivre.livre_numerique &&
      oldLivreNumeriquePath &&
      fs.existsSync(oldLivreNumeriquePath)
    ) {
      fs.unlinkSync(oldLivreNumeriquePath);
    }

    // Mettre à jour le livre dans la base de données
    const update_livre = await prisma.livre.update({
      where: { livre_id: livre.livre_id },
      data: {
        titre: livre.titre,
        nb_pages: livre.nb_pages,
        description: livre.description,
        type_livre: livre.type_livre,
        domaine: livre.domaine,
        couverture: livre.couverture,
        livre_numerique: livre.livre_numerique,
        auteur_id: livre.auteur_id,
        proprietaire_id: livre.proprietaire_id,
      },
    });

    return res.status(200).json(update_livre);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
