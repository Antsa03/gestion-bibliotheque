/*
  Warnings:

  - You are about to drop the column `exemplaire_id` on the `Emprunt` table. All the data in the column will be lost.
  - The `emprunt_statut` column on the `Emprunt` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Exemplaire` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `exemplaire_id` on the `Exemplaire` table. All the data in the column will be lost.
  - You are about to drop the column `exemplaire_num` on the `Exemplaire` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Livre` table. All the data in the column will be lost.
  - The primary key for the `Sanction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_sanction` on the `Sanction` table. All the data in the column will be lost.
  - Added the required column `isbn` to the `Emprunt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isbn` to the `Exemplaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_livre` to the `Livre` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Emprunt" DROP CONSTRAINT "Emprunt_exemplaire_id_fkey";

-- DropForeignKey
ALTER TABLE "Emprunt" DROP CONSTRAINT "Emprunt_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Exemplaire" DROP CONSTRAINT "Exemplaire_livre_id_fkey";

-- DropForeignKey
ALTER TABLE "Livre" DROP CONSTRAINT "Livre_auteur_id_fkey";

-- DropForeignKey
ALTER TABLE "Livre" DROP CONSTRAINT "Livre_proprietaire_id_fkey";

-- DropForeignKey
ALTER TABLE "Sanction" DROP CONSTRAINT "Sanction_user_id_fkey";

-- AlterTable
ALTER TABLE "Emprunt" DROP COLUMN "exemplaire_id",
ADD COLUMN     "isbn" TEXT NOT NULL,
ALTER COLUMN "emprunt_date" SET DATA TYPE DATE,
DROP COLUMN "emprunt_statut",
ADD COLUMN     "emprunt_statut" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Exemplaire" DROP CONSTRAINT "Exemplaire_pkey",
DROP COLUMN "exemplaire_id",
DROP COLUMN "exemplaire_num",
ADD COLUMN     "disponible" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isbn" TEXT NOT NULL,
ADD CONSTRAINT "Exemplaire_pkey" PRIMARY KEY ("isbn");

-- AlterTable
ALTER TABLE "Livre" DROP COLUMN "type",
ADD COLUMN     "livre_numerique" TEXT,
ADD COLUMN     "type_livre" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Sanction" DROP CONSTRAINT "Sanction_pkey",
DROP COLUMN "id_sanction",
ADD COLUMN     "sanction_id" SERIAL NOT NULL,
ADD CONSTRAINT "Sanction_pkey" PRIMARY KEY ("sanction_id");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profile" TEXT NOT NULL DEFAULT 'user.png',
ALTER COLUMN "role" SET DEFAULT 'Adhérent';

-- AddForeignKey
ALTER TABLE "Sanction" ADD CONSTRAINT "Sanction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emprunt" ADD CONSTRAINT "Emprunt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emprunt" ADD CONSTRAINT "Emprunt_isbn_fkey" FOREIGN KEY ("isbn") REFERENCES "Exemplaire"("isbn") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livre" ADD CONSTRAINT "Livre_auteur_id_fkey" FOREIGN KEY ("auteur_id") REFERENCES "Auteur"("auteur_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livre" ADD CONSTRAINT "Livre_proprietaire_id_fkey" FOREIGN KEY ("proprietaire_id") REFERENCES "Proprietaire"("proprietaire_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exemplaire" ADD CONSTRAINT "Exemplaire_livre_id_fkey" FOREIGN KEY ("livre_id") REFERENCES "Livre"("livre_id") ON DELETE CASCADE ON UPDATE CASCADE;
