"use client";
import ActionLoading from "@/components/action-loading.component";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreate } from "@/hooks/useCreate.hook";
import { showToast } from "@/lib/showSwal";
import { Proprietaire } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { CirclePlus, SquareUser } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function AddModalProprietaire() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Proprietaire>({
    mode: "all",
  });

  //Instance de query client (React query)
  const queryClient = useQueryClient();
  const create_proprietaire = useCreate<Proprietaire>(
    "/api/proprietaires/create",
    () => {
      showToast(
        "Information",
        "Le  proprietaire a été créé avec succès",
        "success"
      );
      queryClient.invalidateQueries({ queryKey: ["proprietaires"] });
      setIsAddOpen(false);
    }
  );

  const handleSubmitProprietaire: SubmitHandler<Proprietaire> = async (
    data
  ) => {
    await create_proprietaire.handleAdd(data);
  };

  //L'état du modal
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    reset();
  }, [isAddOpen, setIsAddOpen]);

  return (
    <>
      <Button onClick={() => setIsAddOpen(true)}>
        <CirclePlus className="h-5 w-5 mr-2" /> Ajouter un nouveau propriétaire
      </Button>
      <ResponsiveDialog
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        title="Ajout de nouveau propriétaire"
        description="Formulaire pour ajouter de nouveau propriétaire"
      >
        {create_proprietaire.isAdding ? (
          <ActionLoading text="En cours d'enregistrement ..." />
        ) : (
          <form
            onSubmit={handleSubmit(handleSubmitProprietaire)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="auteur_nom">Nom du propriétaire</Label>
                <div className="relative">
                  <SquareUser
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    {...register("proprietaire_nom", {
                      required: "Le nom du propriétaire est requis",
                    })}
                    className={`pl-10 ${
                      errors.proprietaire_nom ? "border-red-500" : ""
                    }`}
                    placeholder="nom ..."
                  />
                </div>
                {errors.proprietaire_nom && (
                  <p className="text-red-500 text-sm">
                    {errors.proprietaire_nom.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button type="submit" className="min-w-[90px]">
                Ok
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsAddOpen(false);
                }}
              >
                Annuler
              </Button>
            </DialogFooter>
          </form>
        )}
      </ResponsiveDialog>
    </>
  );
}
