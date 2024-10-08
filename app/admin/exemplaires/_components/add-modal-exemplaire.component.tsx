"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCreate } from "@/hooks/useCreate.hook";
import { useFetchData } from "@/hooks/useFetchData.hook";
import { showToast } from "@/lib/showSwal";
import { Exemplaire, Livre } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BarcodeIcon, BookText, CaseLowerIcon, CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { IMG_BASE_URL } from "@/constants/img-base-url.constant";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import ActionLoading from "@/components/action-loading.component";

export default function AddModalExemplaire() {
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

  const queryClient = useQueryClient();
  const create_exemplaire = useCreate<Exemplaire>(
    "/api/exemplaires/create",
    () => {
      showToast(
        "Information",
        "L'exemplaire a été créé avec succès",
        "success"
      );
      queryClient.invalidateQueries({ queryKey: ["exemplaires"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setIsAddOpen(false);
    }
  );

  const handleSubmitExemplaire: SubmitHandler<Exemplaire> = async (data) => {
    // Ajuster la date pour éviter le problème de décalage
    const transformedData: Exemplaire = {
      ...data,
      livre_id: Number(data.livre_id),
    };
    await create_exemplaire.handleAdd(transformedData);
  };

  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    reset();
  }, [isAddOpen, setIsAddOpen]);

  return (
    <>
      <Button onClick={() => setIsAddOpen(true)}>
        <CirclePlus className="h-5 w-5 mr-2" /> Ajouter un nouvel exemplaire
      </Button>
      <ResponsiveDialog
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        title="Ajout de nouvel exemplaire"
        description="Formulaire pour ajouter un nouvel exemplaire"
      >
        {create_exemplaire.isAdding ? (
          <ActionLoading text="En cours d'enregistrement ..." />
        ) : (
          <form
            onSubmit={handleSubmit(handleSubmitExemplaire)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN</Label>
                <div className="relative">
                  <BarcodeIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    {...register("isbn", {
                      required: "ISBN est requis",
                    })}
                    className={`pl-10 ${errors.isbn ? "border-red-600" : ""}`}
                  />
                </div>
                {errors.isbn && (
                  <p className="text-red-500 text-sm">{errors.isbn.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cote">Cote</Label>
                <div className="relative">
                  <CaseLowerIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    {...register("cote", {
                      required: "Cote est requise",
                    })}
                    className={`pl-10 ${errors.cote ? "border-red-600" : ""}`}
                  />
                </div>
                {errors.cote && (
                  <p className="text-red-500 text-sm">{errors.cote.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="livre_id">Livre</Label>
                <div className="relative">
                  <BookText
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
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
                          className={`pl-10 border rounded-md p-1 shadow-sm h-32 ${
                            errors.livre_id ? "border-red-600" : ""
                          }`}
                        >
                          <span className="pl-10">
                            <SelectValue placeholder="Sélectionnez le livre" />
                          </span>
                        </SelectTrigger>
                        <SelectContent className="h-60">
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
                                  <span className="ml-4 flex-1">
                                    {livre.titre}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {errors.livre_id && (
                  <p className="text-red-500 text-sm">
                    {errors.livre_id.message}
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
