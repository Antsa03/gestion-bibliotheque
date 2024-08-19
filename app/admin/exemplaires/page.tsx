"use client";
import React from "react";
import AddModalExemplaire from "./_components/add-modal-exemplaire.component";
import { ExemplaireDataTable } from "./_components/exemplaire-data-table.component";
import { useFetchData } from "@/hooks/useFetchData.hook";
import { Livre, Exemplaire as PrismaExemplaire } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

type Exemplaire = PrismaExemplaire & {
  livre: Livre;
};
function ExemplairePage() {
  const { fetchData } = useFetchData<Exemplaire[]>("/api/exemplaires");
  const {
    data: exemplaires,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["exemplaires"],
    queryFn: fetchData,
  });

  if (isLoading) return <div>Chargement ...</div>;
  if (isError) <div>Erreur: {error.message}</div>;
  return (
    <div className="p-2">
      <h1>exemplaires</h1>
      <AddModalExemplaire />
      <ExemplaireDataTable exemplaires={exemplaires ?? []} />
    </div>
  );
}

export default ExemplairePage;
