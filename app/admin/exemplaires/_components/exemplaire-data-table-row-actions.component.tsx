"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Row } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDelete } from "@/hooks/useDelete.hook";
import { showToast } from "@/lib/showSwal";
import { Exemplaire } from "@prisma/client";
import UpdateModalExemplaire from "./update-modal-exemplaire.component";

export function DataExemplaireRowActions({ row }: { row: Row<Exemplaire> }) {
  const queryClient = useQueryClient();
  const delete_exemplaire = useDelete("/api/exemplaires/delete", () => {
    showToast(
      "Information",
      "L'exemplaire a été supprimé avec succès",
      "success"
    );
  });

  const mutation = useMutation({
    mutationFn: (id: string | number) => delete_exemplaire.handleDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exemplaires"] });
    },
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const exemplaire = row.original;
  return (
    <div className="flex items-center">
      <UpdateModalExemplaire
        exemplaire={exemplaire}
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
      />
      <Button
        className="text-yellow-500"
        variant="link"
        onClick={() => setIsEditOpen(true)}
      >
        <Pencil className="h-6 w-6" />
      </Button>
      <Button
        onClick={async () => await mutation.mutateAsync(row.original.isbn)}
        variant="link"
        className="text-red-500"
      >
        <Trash2 className="h-6 w-6" />
      </Button>
    </div>
  );
}
