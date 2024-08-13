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
    const delete_user = await prisma.user.delete({
      where: { user_id: id },
    });
    return res.status(200).json(delete_user);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
