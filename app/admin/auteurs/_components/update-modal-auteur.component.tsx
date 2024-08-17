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
import { useUpdate } from "@/hooks/useUpdate.hook";
import { showToast } from "@/lib/showSwal";
import { Auteur } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type UpdateModalAuteur = {
  auteur: Auteur;
  isEditOpen: boolean;
  setIsEditOpen: Dispatch<SetStateAction<boolean>>;
};

export default function UpdateModalAuteur({
  auteur,
  isEditOpen,
  setIsEditOpen,
}: UpdateModalAuteur) {
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
  const update_auteur = useUpdate<Auteur>("/api/auteurs/update", () => {
    showToast("Information", "L'auteur a été modifié avec succès", "success");
    setIsEditOpen(false);
    queryClient.invalidateQueries({ queryKey: ["auteurs"] });
  });

  const handleSubmitAuteur: SubmitHandler<Auteur> = async (data) => {
    await update_auteur.handleUpdate(data);
  };

  useEffect(() => {
    reset(auteur);
  }, [auteur, reset]);

  return (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Ajout de nouvel auteur
          </DialogTitle>
          <DialogDescription>
            Formulaire pour modifier de nouvel auteur
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSubmitAuteur)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="auteur_nom" className="text-center">
                Nom de l'auteur
              </Label>
              <Input
                {...register("auteur_nom", {
                  required: "Le nom d'auteur est requis",
                })}
                className={`col-span-3 ${
                  errors.auteur_nom ? "border-red-600" : ""
                }`}
              />
              {errors.auteur_nom && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.auteur_nom.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-[90px]">
              Ok
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditOpen(false)}
            >
              Annuler
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
