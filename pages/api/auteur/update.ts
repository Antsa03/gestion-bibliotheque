import prisma from "@/lib/prisma-client";
import { Auteur } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "PUT")
      return res.status(401).json("Méthode non autorisé");
    const auteur: Auteur = req.body;
    const create_auteur = await prisma.auteur.update({
      where: { auteur_id: auteur.auteur_id },
      data: {
        auteur_nom: auteur.auteur_nom,
      },
    });
    return res.status(200).json(create_auteur);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
