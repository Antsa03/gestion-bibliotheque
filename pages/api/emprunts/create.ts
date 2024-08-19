import prisma from "@/lib/prisma-client";
import { Emprunt } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST")
      return res.status(401).json("Méthode non autorisé");
    const emprunt: Emprunt = req.body;
    const create_emprunt = await prisma.emprunt.create({
      data: {
        ...emprunt,
        emprunt_date: new Date(emprunt.emprunt_date),
        emprunt_retour_prevue: new Date(emprunt.emprunt_retour_prevue),
      },
      include: {
        user: true,
        exemplaire: true,
      },
    });
    if (create_emprunt) {
      await prisma.exemplaire.update({
        where: { isbn: create_emprunt.isbn },
        data: {
          disponible: false,
        },
      });
    }
    return res.status(200).json(create_emprunt);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
