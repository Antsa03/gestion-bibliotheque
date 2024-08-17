import prisma from "@/lib/prisma-client";
import { Exemplaire } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST")
      return res.status(401).json("Méthode non autorisé");
    const exemplaire: Exemplaire = req.body;
    const create_exemplaire = await prisma.exemplaire.create({
      data: exemplaire,
      include: {
        livre: true,
      },
    });
    return res.status(200).json(create_exemplaire);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
