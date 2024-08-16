import prisma from "@/lib/prisma-client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const proprietaires = await prisma.proprietaire.findMany();
    return res.status(200).json(proprietaires);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
