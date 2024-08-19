"use client";
import React from "react";
import AddModalSanction from "./_components/add-modal-sanction.component";
import { SanctionDataTable } from "./_components/sanction-data-table.component";
import { useFetchData } from "@/hooks/useFetchData.hook";
import { Sanction as PrismaSanction, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

type Sanction = PrismaSanction & {
  user: User;
};

function SanctionsPage() {
  const { fetchData } = useFetchData<Sanction[]>("/api/sanctions");
  const {
    data: sanctions,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["sanctions"],
    queryFn: fetchData,
  });

  if (isLoading) return <div>Chargement ...</div>;
  if (isError) return <div>Erreur: {error.message}</div>;
  return (
    <div className="p-2">
      <h1>sanctions</h1>
      <AddModalSanction />
      <SanctionDataTable sanctions={sanctions ?? []} />
    </div>
  );
}

export default SanctionsPage;
