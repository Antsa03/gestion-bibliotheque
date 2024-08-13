-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" VARCHAR(12) NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Auteur" (
    "auteur_id" SERIAL NOT NULL,
    "auteur_nom" TEXT NOT NULL,

    CONSTRAINT "Auteur_pkey" PRIMARY KEY ("auteur_id")
);

-- CreateTable
CREATE TABLE "Sanction" (
    "id_sanction" SERIAL NOT NULL,
    "sanction_deb" DATE NOT NULL,
    "sanction_fin" DATE NOT NULL,
    "sanction_motif" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Sanction_pkey" PRIMARY KEY ("id_sanction")
);

-- CreateTable
CREATE TABLE "Emprunt" (
    "emprunt_id" SERIAL NOT NULL,
    "emprunt_date" TIMESTAMP(3) NOT NULL,
    "emprunt_retour" DATE,
    "emprunt_retour_prevue" DATE NOT NULL,
    "emprunt_statut" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "exemplaire_id" INTEGER NOT NULL,

    CONSTRAINT "Emprunt_pkey" PRIMARY KEY ("emprunt_id")
);

-- CreateTable
CREATE TABLE "Livre" (
    "livre_id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "nb_pages" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "domaine" TEXT NOT NULL,
    "couverture" TEXT NOT NULL,
    "auteur_id" INTEGER NOT NULL,
    "proprietaire_id" INTEGER NOT NULL,

    CONSTRAINT "Livre_pkey" PRIMARY KEY ("livre_id")
);

-- CreateTable
CREATE TABLE "Exemplaire" (
    "exemplaire_id" SERIAL NOT NULL,
    "cote" TEXT NOT NULL,
    "exemplaire_num" INTEGER NOT NULL,
    "livre_id" INTEGER NOT NULL,

    CONSTRAINT "Exemplaire_pkey" PRIMARY KEY ("exemplaire_id")
);

-- CreateTable
CREATE TABLE "Proprietaire" (
    "proprietaire_id" SERIAL NOT NULL,
    "proprietaire_nom" TEXT NOT NULL,

    CONSTRAINT "Proprietaire_pkey" PRIMARY KEY ("proprietaire_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Sanction" ADD CONSTRAINT "Sanction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emprunt" ADD CONSTRAINT "Emprunt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emprunt" ADD CONSTRAINT "Emprunt_exemplaire_id_fkey" FOREIGN KEY ("exemplaire_id") REFERENCES "Exemplaire"("exemplaire_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livre" ADD CONSTRAINT "Livre_auteur_id_fkey" FOREIGN KEY ("auteur_id") REFERENCES "Auteur"("auteur_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livre" ADD CONSTRAINT "Livre_proprietaire_id_fkey" FOREIGN KEY ("proprietaire_id") REFERENCES "Proprietaire"("proprietaire_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exemplaire" ADD CONSTRAINT "Exemplaire_livre_id_fkey" FOREIGN KEY ("livre_id") REFERENCES "Livre"("livre_id") ON DELETE RESTRICT ON UPDATE CASCADE;
