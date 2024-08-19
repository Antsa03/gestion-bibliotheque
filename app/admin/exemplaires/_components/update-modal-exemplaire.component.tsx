import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdate } from "@/hooks/useUpdate.hook";
import { showToast } from "@/lib/showSwal";
import { Exemplaire, Livre } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useFetchData } from "@/hooks/useFetchData.hook";
import Image from "next/image";
import { IMG_BASE_URL } from "@/constants/img-base-url.constant";

type UpdateModalExemplaireProps = {
  exemplaire: Exemplaire;
  isEditOpen: boolean;
  setIsEditOpen: Dispatch<SetStateAction<boolean>>;
};

export default function UpdateModalExemplaire({
  exemplaire,
  isEditOpen,
  setIsEditOpen,
}: UpdateModalExemplaireProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Exemplaire>({
    mode: "all",
  });

  //Récupérer les livres
  const { fetchData } = useFetchData<Livre[]>("/api/livres");
  const { data: livres } = useQuery({
    queryKey: ["livres"],
    queryFn: fetchData,
  });

  //Instance de query client (React query)
  const queryClient = useQueryClient();
  const update_exemplaire = useUpdate<Exemplaire>(
    "/api/exemplaires/update",
    () => {
      showToast(
        "Information",
        "L'exemplaire a été modifiée avec succès",
        "success"
      );
      setIsEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["exemplaires"] });
    }
  );

  const handleSubmitExemplaire: SubmitHandler<Exemplaire> = async (data) => {
    const transformedData: Exemplaire = {
      ...data,
      livre_id: Number(data.livre_id),
    };
    await update_exemplaire.handleUpdate(transformedData);
  };

  useEffect(() => {
    reset(exemplaire);
  }, [exemplaire, reset]);

  return (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modification de l'exemplaire</DialogTitle>
          <DialogDescription>
            Formulaire pour modifier l'exemplaire
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSubmitExemplaire)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="isbn" className="text-center">
                ISBN
              </Label>
              <Input
                {...register("isbn", {
                  required: "ISBN est requis",
                })}
                className={`col-span-3 ${errors.isbn ? "border-red-600" : ""}`}
              />
              {errors.isbn && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.isbn.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="cote" className="text-center">
                Cote
              </Label>
              <Input
                {...register("cote", {
                  required: "Cote est requise",
                })}
                className={`col-span-3 ${errors.cote ? "border-red-600" : ""}`}
              />
              {errors.cote && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.cote.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="livre_id" className="text-center">
                Livre
              </Label>
              <Controller
                name="livre_id"
                control={control}
                rules={{ required: "Livre est requis" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger
                      className={`col-span-3 border rounded-md p-1 shadow-sm h-28 ${
                        errors.livre_id ? "border-red-600 text-red-600" : ""
                      }`}
                    >
                      <SelectValue placeholder="Sélectionnez le livre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Livre</SelectLabel>
                        {livres?.map((livre) => (
                          <SelectItem
                            key={livre.livre_id}
                            value={livre.livre_id.toString()}
                          >
                            <div className="flex items-center w-full">
                              <Image
                                src={IMG_BASE_URL + livre.couverture}
                                alt={`Couverture de ${livre.titre}`}
                                width={90}
                                height={90}
                                className="w-24 h-24 object-cover rounded-sm"
                              />
                              <span className="ml-4 flex-1">{livre.titre}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.livre_id && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.livre_id.message}
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
              onClick={() => {
                setIsEditOpen(false);
              }}
            >
              Annuler
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
