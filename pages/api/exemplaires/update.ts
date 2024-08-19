import prisma from "@/lib/prisma-client";
import { Exemplaire, Livre } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "PUT")
      return res.status(401).json("Méthode non autorisé");
    const exemplaire: Exemplaire = req.body;
    const update_exemplaire = await prisma.exemplaire.update({
      where: { isbn: exemplaire.isbn },
      data: {
        cote: exemplaire.cote,
        livre_id: exemplaire.livre_id,
      },
      include: {
        livre: true,
      },
    });
    return res.status(200).json(update_exemplaire);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
