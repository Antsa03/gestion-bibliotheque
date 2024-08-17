import prisma from "@/lib/prisma-client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "DELETE")
      return res.status(401).json("Méthode non autorisé");
    const { id } = req.body;
    const delete_emprunt = await prisma.emprunt.delete({
      where: { emprunt_id: id },
      include: {
        user: true,
        exemplaire: true,
      },
    });
    if (delete_emprunt) {
      await prisma.exemplaire.update({
        where: { code_barre: delete_emprunt.code_barre },
        data: {
          disponible: true,
        },
      });
      return res.status(200).json(delete_emprunt);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
