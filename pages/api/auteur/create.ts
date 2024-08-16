import prisma from "@/lib/prisma-client";
import { Auteur } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST")
      return res.status(401).json("Méthode non autorisé");
    const auteur: Auteur = req.body;
    const create_auteur = await prisma.auteur.create({
      data: auteur,
    });
    return res.status(200).json(create_auteur);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
