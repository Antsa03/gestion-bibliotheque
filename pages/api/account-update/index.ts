import prisma from "@/lib/prisma-client";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { capitalizeWords } from "@/lib/capitalize-word";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "PUT")
      return res.status(401).json("Méthode non autorisée");
    const user: User = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { user_id: user.user_id },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Définir les chemins des anciens fichiers
    const oldProfilePath = existingUser.profile
      ? path.join(
          process.cwd(),
          "uploads",
          "users",
          "profiles",
          existingUser.profile
        )
      : null;

    // Supprimer les anciens fichiers si de nouveaux fichiers sont fournis, à condition que le fichier ne soit pas "user.png"
    if (
      user.profile &&
      user.profile !== "user.png" &&
      existingUser.profile !== "user.png" &&
      oldProfilePath &&
      fs.existsSync(oldProfilePath)
    ) {
      fs.unlinkSync(oldProfilePath);
    }

    const update_user = await prisma.user.update({
      where: { user_id: user.user_id },
      data: {
        profile: user.profile,
        name: user.name.toUpperCase(),
        firstname: capitalizeWords(user.firstname),
        address: user.address,
        phone: user.phone,
        email: user.email,
      },
    });
    return res.status(200).json(update_user);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
