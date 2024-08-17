import prisma from "@/lib/prisma-client";
import { Emprunt } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "PUT")
      return res.status(401).json("Méthode non autorisé");
    const emprunt: Emprunt = req.body;
    const update_emprunt = await prisma.emprunt.update({
      where: { emprunt_id: emprunt.emprunt_id },
      data: {
        emprunt_date: new Date(emprunt.emprunt_date),
        emprunt_retour_prevue: new Date(emprunt.emprunt_retour_prevue),
        user_id: emprunt.user_id,
        code_barre: emprunt.code_barre,
      },
      include: {
        user: true,
        exemplaire: true,
      },
    });
    return res.status(200).json(update_emprunt);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
