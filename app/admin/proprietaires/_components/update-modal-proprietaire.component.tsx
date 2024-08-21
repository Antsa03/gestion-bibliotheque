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
import InputError from "@/components/ui/input-error";
import { Label } from "@/components/ui/label";
import { useUpdate } from "@/hooks/useUpdate.hook";
import { showToast } from "@/lib/showSwal";
import { Proprietaire } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
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

  const handleSubmitAuteur: SubmitHandler<Proprietaire> = async (data) => {
    await update_proprietaire.handleUpdate(data);
  };

  useEffect(() => {
    reset(proprietaire);
  }, [proprietaire, reset]);

  return (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modification du propriétaire</DialogTitle>
          {/* <DialogDescription>
            Formulaire pour modifier le propriétaire
          </DialogDescription> */}
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSubmitAuteur)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="proprietaire_nom" className="text-center">
                Nom du propriétaire
              </Label>
              <Input
                {...register("proprietaire_nom", {
                  required: "Le nom du propriétaire est requis",
                })}
                className={`col-span-3 ${
                  errors.proprietaire_nom ? "border-red-600" : ""
                }`}
              />
              {errors.proprietaire_nom && (
                <InputError
                  message={errors.proprietaire_nom?.message}
                  classname="col-start-2 col-span-3 pl-2"
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="no-bg-destructive"
              onClick={() => setIsEditOpen(false)}
              className="hover:bg-red-100 rounded-full"
            >
              Annuler
            </Button>
            <Button type="submit" className="w-[90px]">
              Modifier
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
