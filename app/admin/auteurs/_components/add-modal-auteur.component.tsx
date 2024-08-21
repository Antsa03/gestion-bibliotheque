"use client";
import ActionLoading from "@/components/action-loading.component";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreate } from "@/hooks/useCreate.hook";
import { showToast } from "@/lib/showSwal";
import { Auteur } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { CirclePlus, UserRoundPen } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function AddModalAuteur() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Auteur>({
    mode: "all",
  });

  //Instance de query client (React query)
  const queryClient = useQueryClient();
  const create_auteur = useCreate<Auteur>("/api/auteurs/create", () => {
    showToast("Information", "L'auteur a été créé avec succès", "success");
    queryClient.invalidateQueries({ queryKey: ["auteurs"] });
    setIsAddOpen(false);
  });

  const handleSubmitAuteur: SubmitHandler<Auteur> = async (data) => {
    await create_auteur.handleAdd(data);
  };

  //L'état du modal
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    reset();
  }, [isAddOpen, setIsAddOpen]);

  return (
    <>
      <Button onClick={() => setIsAddOpen(true)}>
        <CirclePlus className="h-5 w-5 mr-2" /> Ajouter un nouvel auteur
      </Button>
      <ResponsiveDialog
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        title="Ajout de nouvel auteur"
        description="Formulaire pour ajouter de nouvel auteur"
      >
        {create_auteur.isAdding ? (
          <ActionLoading text="En cours d'enregistrement ..." />
        ) : (
          <form
            onSubmit={handleSubmit(handleSubmitAuteur)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="auteur_nom">Nom de l'auteur</Label>
                <div className="relative">
                  <UserRoundPen
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    {...register("auteur_nom", {
                      required: "Nom de l'auteur requis",
                    })}
                    className={`pl-10 ${
                      errors.auteur_nom ? "border-red-500" : ""
                    }`}
                    placeholder="nom ..."
                  />
                </div>
                {errors.auteur_nom && (
                  <p className="text-red-500 text-sm">
                    {errors.auteur_nom.message}
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
