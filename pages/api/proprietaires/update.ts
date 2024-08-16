import prisma from "@/lib/prisma-client";
import { Proprietaire } from "@prisma/client";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "PUT")
      return res.status(401).json("Méthode non autorisé");
    const proprietaire: Proprietaire = req.body;
    const update_proprietaire = await prisma.proprietaire.update({
      where: { proprietaire_id: proprietaire.proprietaire_id },
      data: {
        proprietaire_nom: proprietaire.proprietaire_nom,
      },
    });
    return res.status(200).json(update_proprietaire);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
