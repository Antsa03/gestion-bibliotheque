import ActionLoading from "@/components/action-loading.component";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdate } from "@/hooks/useUpdate.hook";
import { showToast } from "@/lib/showSwal";
import { Auteur } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { UserRoundPen } from "lucide-react";
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
    <ResponsiveDialog
      isOpen={isEditOpen}
      setIsOpen={setIsEditOpen}
      title="Modification de l'auteur"
      description="Formulaire pour modifier l'auteur"
    >
      {update_auteur.isUpdating ? (
        <ActionLoading text="En cours de modification ..." />
      ) : (
        <form onSubmit={handleSubmit(handleSubmitAuteur)} className="space-y-6">
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
