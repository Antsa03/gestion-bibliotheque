import prisma from "@/lib/prisma-client";
import { Livre } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "PUT")
      return res.status(401).json("Méthode non autorisé");
    const livre: Livre = req.body;
    const update_livre = await prisma.livre.update({
      where: { livre_id: livre.livre_id },
      data: {
        ...livre,
      },
    });
    return res.status(200).json(update_livre);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
