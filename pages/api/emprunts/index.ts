import prisma from "@/lib/prisma-client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const emprunts = await prisma.emprunt.findMany({
      include: {
        exemplaire: true,
        user: true,
      },
    });
    return res.status(200).json(emprunts);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
