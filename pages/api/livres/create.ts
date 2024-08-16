import prisma from "@/lib/prisma-client";
import { Livre } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST")
      return res.status(401).json("Méthode non autorisé");
    const livre: Livre = req.body;
    const create_livre = await prisma.livre.create({
      data: livre,
    });
    return res.status(200).json(create_livre);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
