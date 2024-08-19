"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Row } from "@tanstack/react-table";
import { Pencil, Trash2, UndoDot } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDelete } from "@/hooks/useDelete.hook";
import { showToast } from "@/lib/showSwal";
import { Emprunt } from "@prisma/client";
import UpdateModalemprunt from "./update-modal-emprunt.component";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Swal from "sweetalert2";
import { useUpdate } from "@/hooks/useUpdate.hook";

export function DataEmpruntRowActions({ row }: { row: Row<Emprunt> }) {
  const queryClient = useQueryClient();
  const delete_emprunt = useDelete("/api/emprunts/delete", () => {
    showToast("Information", "L'emprunt a été supprimé avec succès", "success");
  });

  const mutation = useMutation({
    mutationFn: (id: string | number) => delete_emprunt.handleDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emprunts"] });
    },
  });

  const { handleUpdate } = useUpdate("/api/emprunts/action-rendre", () => {
    queryClient.invalidateQueries({ queryKey: ["emprunts"] });
    queryClient.invalidateQueries({ queryKey: ["exemplaires"] });
    showToast("Rendre", "Le livre est rendu avec succès", "success");
  });

  const actionRendre = async (id: string | number) => {
    const result = await Swal.fire({
      title: "Rendre un exemplaire de livre",
      text: "Voulez vous vraiment rendre l'exemplaire du livre?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
      // customClass: "custom-alert",
    });
    if (result.isConfirmed) {
      handleUpdate({ id });
    }
  };

  const [isEditOpen, setIsEditOpen] = useState(false);
  const emprunt = row.original;

  return (
    <div className="flex items-center">
      <UpdateModalemprunt
        emprunt={emprunt}
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
      />
      {emprunt.emprunt_statut ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="text-blue-500"
                variant="link"
                onClick={() => actionRendre(emprunt.emprunt_id)}
              >
                <UndoDot className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rendre</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="text-yellow-500"
              variant="link"
              onClick={() => setIsEditOpen(true)}
            >
              <Pencil className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Modifier</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={async () =>
                await mutation.mutateAsync(row.original.emprunt_id)
              }
              variant="link"
              className="text-red-500"
            >
              <Trash2 className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Supprimer</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
