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
import { useUpdate } from "@/hooks/useUpdate.hook";
import { showToast } from "@/lib/showSwal";
import { Proprietaire } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { SquareUser } from "lucide-react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type UpdateModalProprietaire = {
  proprietaire: Proprietaire;
  isEditOpen: boolean;
  setIsEditOpen: Dispatch<SetStateAction<boolean>>;
};

export default function UpdateModalProprietaire({
  proprietaire,
  isEditOpen,
  setIsEditOpen,
}: UpdateModalProprietaire) {
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
  const update_proprietaire = useUpdate<Proprietaire>(
    "/api/proprietaires/update",
    () => {
      showToast(
        "Information",
        "Le propriétaire a été modifié avec succès",
        "success"
      );
      setIsEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["proprietaires"] });
    }
  );

  const handleSubmitProprietaire: SubmitHandler<Proprietaire> = async (
    data
  ) => {
    await update_proprietaire.handleUpdate(data);
  };

  useEffect(() => {
    reset(proprietaire);
  }, [proprietaire, reset]);

  return (
    <ResponsiveDialog
      isOpen={isEditOpen}
      setIsOpen={setIsEditOpen}
      title="Modification du propriétaire"
      description="Formulaire pour modifier le propriétaire"
    >
      {update_proprietaire.isUpdating ? (
        <ActionLoading text="En cours de ..." />
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
                setIsEditOpen(false);
              }}
            >
              Annuler
            </Button>
          </DialogFooter>
        </form>
      )}
    </ResponsiveDialog>
  );
}
