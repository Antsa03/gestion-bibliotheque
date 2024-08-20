import prisma from "@/lib/prisma-client";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import bcryptjs from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST")
      return res.status(401).json("Méthode non autorisé");
    const user: User = req.body;
    const create_user = await prisma.user.create({
      data: {
        profile: user.profile === "" ? "user.png" : user.profile,
        name: user.name.toUpperCase(),
        firstname: user.firstname,
        address: user.address,
        phone: user.phone,
        email: user.email,
        password: await bcryptjs.hash(user.password, 10),
      },
    });
    return res.status(200).json(create_user);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
