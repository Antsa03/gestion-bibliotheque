import prisma from "@/lib/prisma-client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.body;
    const delete_auteur = await prisma.auteur.delete({
      where: { auteur_id: id },
    });
    return res.status(200).json(delete_auteur);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
