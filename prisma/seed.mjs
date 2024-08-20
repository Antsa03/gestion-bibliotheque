import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "super.admin@gmail.com" },
    update: {},
    create: {
      profile: "user.png", // Correspond à photo_profil
      name: "SUPER",
      firstname: "Administrateur", // Correspond à prenom
      address: "Default", // Correspond à adresse
      phone: "0000000000", // Correspond à telephone
      role: "Administrateur", // Définit le rôle comme Administrateur
      email: "super.admin@gmail.com",
      password: await bcrypt.hash("Admin1234", 10),
    },
  });

  console.log(user);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
