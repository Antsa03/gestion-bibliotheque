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

  // if (isLoading) return <div>Chargement ...</div>;
  if (isError) return <div>Erreur: {error.message}</div>;
  return (
    <div className="relative h-full w-full min-h-screen">
      <div className="w-full flex justify-between mt-4 mb-4">
        <h1 className="text-2xl font-bold capitalize ">Auteurs</h1>
        <AddModalAuteur />
      </div>

      {isLoading ? (
        <div className="relative h-full w-full flex justify-center items-center">
          Chargement ...
        </div>
      ) : (
        <AuteurDataTable auteurs={auteurs ?? []} />
      )}
    </div>
  );
}

export default AuteurPage;
