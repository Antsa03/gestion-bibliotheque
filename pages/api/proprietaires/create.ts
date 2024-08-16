import prisma from "@/lib/prisma-client";
import { Proprietaire } from "@prisma/client";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST")
      return res.status(401).json("Méthode non autorisé");
    const proprietaire: Proprietaire = req.body;
    const create_proprietaire = await prisma.proprietaire.create({
      data: proprietaire,
    });
    return res.status(200).json(create_proprietaire);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
