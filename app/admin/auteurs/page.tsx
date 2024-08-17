"use client";
import { useFetchData } from "@/hooks/useFetchData.hook";
import { Auteur } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import AddModalAuteur from "./_components/add-modal-auteur.component";
import { AuteurDataTable } from "./_components/auteur-data-table.component";

function AuteurPage() {
  const auteur_data = useFetchData<Auteur[]>("/api/auteurs");
  const {
    data: auteurs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["auteurs"],
    queryFn: auteur_data.fetchData,
  });

  if (isLoading) return <div>Chargement ...</div>;
  if (isError) return <div>Erreur: {error.message}</div>;
  return (
    <div className="p-4">
      <h1>Auteurs</h1>
      <AddModalAuteur />
      <AuteurDataTable auteurs={auteurs ?? []} />
    </div>
  );
}

export default AuteurPage;
