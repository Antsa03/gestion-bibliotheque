import prisma from "@/lib/prisma-client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "PUT")
      return res.status(401).json("Méthode non autorisé");
    const { id } = req.body;
    const rendre = await prisma.emprunt.update({
      where: { emprunt_id: id },
      data: {
        emprunt_statut: false,
        emprunt_retour: new Date(),
      },
    });
    if (rendre) {
      await prisma.exemplaire.update({
        where: { isbn: rendre.isbn },
        data: {
          disponible: true,
        },
      });
      return res.status(200).json("Exemplaire du livre rendu avec succès");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
