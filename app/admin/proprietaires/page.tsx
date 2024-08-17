"use client";
import { useFetchData } from "@/hooks/useFetchData.hook";
import { Proprietaire } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ProprietaireDataTable } from "./_components/proprietaire-data-table.component";
import AddModalProprietaire from "./_components/add-modal-proprietaire.component";

function ProprietairePage() {
  const proprietaire_data = useFetchData<Proprietaire[]>("/api/proprietaires");
  const {
    data: proprietaires,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["proprietaires"],
    queryFn: proprietaire_data.fetchData,
  });

  if (isLoading) return <div>Chargement ...</div>;
  if (isError) return <div>Erreur: {error.message}</div>;
  return (
    <div className="p-4">
      <h1>proprietaires</h1>
      <AddModalProprietaire />
      <ProprietaireDataTable proprietaires={proprietaires ?? []} />
    </div>
  );
}

export default ProprietairePage;
