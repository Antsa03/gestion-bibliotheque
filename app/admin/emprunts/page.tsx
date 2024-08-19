"use client";
import React from "react";
import AddModalEmprunt from "./_components/add-modal-emprunt.component";
import { EmpruntDataTable } from "./_components/emprunt-data-table.component";
import { useFetchData } from "@/hooks/useFetchData.hook";
import {
  Exemplaire as PrismaExemplaire,
  Emprunt as PrismaEmprunt,
  User,
  Livre,
} from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

type Exemplaire = PrismaExemplaire & {
  livre: Livre;
};

type Emprunt = PrismaEmprunt & {
  user: User;
  exemplaire: Exemplaire;
};

function EmpruntPage() {
  const { fetchData } = useFetchData<Emprunt[]>("/api/emprunts");
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["emprunts"],
    queryFn: fetchData,
  });

  if (isLoading) return <div>Chargement ...</div>;
  if (isError) return <div>Erreur: {error.message}</div>;

  const emprunts = data ? data : [];
  return (
    <div className="p-2">
      <h1>emprunts</h1>
      <AddModalEmprunt />
      <EmpruntDataTable emprunts={emprunts} />
    </div>
  );
}

export default EmpruntPage;
