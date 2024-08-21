"use client";
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
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/lib/showSwal";
import { Auteur, Livre, Proprietaire } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useFetchData } from "@/hooks/useFetchData.hook";
import { useUpdate } from "@/hooks/useUpdate.hook";
import InputError from "@/components/ui/input-error";

type UpdateModalLivreProps = {
  livre: Livre;
  isEditOpen: boolean;
  setIsEditOpen: Dispatch<SetStateAction<boolean>>;
};

export default function UpdateModalLivre({
  livre,
  isEditOpen,
  setIsEditOpen,
}: UpdateModalLivreProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Livre>({
    mode: "all",
  });

  //Récupérer l'auteur et le propriétaire
  const proprietaire_data = useFetchData<Proprietaire[]>("/api/proprietaires");
  const { data: proprietaires } = useQuery({
    queryKey: ["proprietaires"],
    queryFn: proprietaire_data.fetchData,
  });

  const auteur_data = useFetchData<Auteur[]>("/api/auteurs");
  const { data: auteurs } = useQuery({
    queryKey: ["auteurs"],
    queryFn: auteur_data.fetchData,
  });

  //Instance de query client (React query)
  const queryClient = useQueryClient();
  const update_livre = useUpdate<Livre>("/api/livres/update", () => {
    showToast("Information", "Le livre a été modifié avec succès", "success");
    queryClient.invalidateQueries({ queryKey: ["livres"] });
    setIsEditOpen(false);
  });

  const handleSubmitLivre: SubmitHandler<Livre> = async (data) => {
    let transformedData: Livre = {
      ...data,
      nb_pages: Number(data.nb_pages),
      auteur_id: Number(data.auteur_id),
      proprietaire_id: Number(data.proprietaire_id),
      couverture: data.couverture, // Use existing couverture by default
      livre_numerique: data.livre_numerique,
    };

    const formData = new FormData();
    let shouldUpload = false;

    if (
      data.couverture &&
      (data.couverture as unknown as FileList).length > 0
    ) {
      formData.append(
        "couverture",
        (data.couverture as unknown as FileList)[0]
      );
      shouldUpload = true;
    }

    if (
      data.livre_numerique &&
      (data.livre_numerique as unknown as FileList).length > 0
    ) {
      formData.append(
        "livre_numerique",
        (data.livre_numerique as unknown as FileList)[0]
      );
      shouldUpload = true;
    }

    if (shouldUpload) {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        transformedData = {
          ...transformedData,
          couverture: result.couvertureFileName || transformedData.couverture,
          livre_numerique:
            result.livreNumeriqueFileName || transformedData.livre_numerique,
        };
      } else {
        console.error("Erreur lors de l'upload", result);
        return; // Stop if the upload failed
      }
    }

    await update_livre.handleUpdate(transformedData);
  };

  useEffect(() => {
    reset(livre);
  }, [livre, reset]);

  return (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modification du livre</DialogTitle>
          {/* <DialogDescription>
            Formulaire pour modifier un livre
          </DialogDescription> */}
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSubmitLivre)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="titre" className="text-left">
                Titre
              </Label>
              <Input
                {...register("titre", {
                  required: "La désignation est requise",
                })}
                className={`col-span-3 ${errors.titre ? "border-red-600" : ""}`}
              />
              {errors.titre && (
                <InputError
                  message={errors.titre.message}
                  classname="col-start-2 col-span-3 pl-2"
                />
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="nb_pages" className="text-left">
                Nombre de page
              </Label>
              <Input
                {...register("nb_pages", {
                  required: "Le nombre de page est requis",
                })}
                className={`col-span-3 ${errors.titre ? "border-red-600" : ""}`}
                type="number"
              />
              {errors.nb_pages && (
                <InputError
                  message={errors.nb_pages.message}
                  classname="col-start-2 col-span-3 pl-2"
                />
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="titre" className="text-left">
                Description
              </Label>
              <Textarea
                {...register("description", {
                  required: "La désignation est requise",
                })}
                className={`col-span-3 bg-primary ${
                  errors.description ? "border-red-600" : ""
                }`}
                placeholder="Petite description du livre"
              />
              {errors.description && (
                <InputError
                  message={errors.description.message}
                  classname="col-start-2 col-span-3 pl-2"
                />
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="type_livre" className="text-left">
                Type du livre
              </Label>
              <Controller
                name="type_livre"
                control={control}
                rules={{ required: "Le type de livre est requis" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="col-span-3 border border-input bg-primary rounded-full px-4 py-2">
                      <SelectValue placeholder="Sélectionnez un type de livre" />
                    </SelectTrigger>
                    <SelectContent
                      className={`col-span-3 ${
                        errors.description ? "border-red-600" : ""
                      }`}
                    >
                      <SelectGroup className="h-60">
                        <SelectLabel>Type du livre</SelectLabel>
                        <SelectItem value="Roman">Roman</SelectItem>
                        <SelectItem value="Nouvelle">Nouvelle</SelectItem>
                        <SelectItem value="Poésie">Poésie</SelectItem>
                        <SelectItem value="Théatre">Théatre</SelectItem>
                        <SelectItem value="Essai">Essai</SelectItem>
                        <SelectItem value="Biographie">Biographie</SelectItem>
                        <SelectItem value="Autobiographie">
                          Autobiographie
                        </SelectItem>
                        <SelectItem value="Documentaire">
                          Documentaire
                        </SelectItem>
                        <SelectItem value="Manga">Nouvelle</SelectItem>
                        <SelectItem value="Jeunesse">
                          Littérature jeunesse
                        </SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type_livre && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.type_livre.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="domaine" className="text-center">
                Domaine
              </Label>
              <Controller
                name="domaine"
                control={control}
                rules={{ required: "Le domaine est requis" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="col-span-3 border rounded-md p-1 shadow-sm">
                      <SelectValue placeholder="Sélectionnez un domaine" />
                    </SelectTrigger>
                    <SelectContent
                      className={`col-span-3 ${
                        errors.domaine ? "border-red-600" : ""
                      }`}
                    >
                      <SelectGroup className="h-60">
                        <SelectLabel>Domaine</SelectLabel>
                        <SelectItem value="Narratif">Narratif</SelectItem>
                        <SelectItem value="Théâtral">Théâtral</SelectItem>
                        <SelectItem value="Poétique">Poétique</SelectItem>
                        <SelectItem value="Scientifique">
                          Scientifique
                        </SelectItem>
                        <SelectItem value="Philosophique">
                          Philosophique
                        </SelectItem>
                        <SelectItem value="Religieux">Religieux</SelectItem>
                        <SelectItem value="Historique">Historique</SelectItem>
                        <SelectItem value="Voyage">Voyage</SelectItem>
                        <SelectItem value="Horreur">Horreur</SelectItem>
                        <SelectItem value="Science-fiction">
                          Science-fiction
                        </SelectItem>
                        <SelectItem value="Fantastique">Fantastique</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.domaine && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.domaine.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="couverture" className="text-center">
                Couverture
              </Label>
              <Input
                {...register("couverture")}
                className="col-span-3"
                type="file"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="livre_numerique" className="text-center">
                Livre numérique
              </Label>
              <Input
                {...register("livre_numerique")}
                type="file"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="auteur_id" className="text-center">
                Auteur
              </Label>
              <Controller
                name="auteur_id"
                control={control}
                rules={{ required: "L'auteur est requis" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger className="col-span-3 border rounded-md p-1 shadow-sm">
                      <SelectValue placeholder="Sélectionnez l'auteur" />
                    </SelectTrigger>
                    <SelectContent
                      className={`col-span-3 ${
                        errors.auteur_id ? "border-red-600" : ""
                      }`}
                    >
                      <SelectGroup>
                        <SelectLabel>L'auteur</SelectLabel>
                        {auteurs?.map((auteur) => (
                          <SelectItem
                            key={auteur.auteur_id}
                            value={auteur.auteur_id.toString()}
                          >
                            {auteur.auteur_nom}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.auteur_id && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.auteur_id.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="proprietaire_id" className="text-center">
                Propriétaire
              </Label>
              <Controller
                name="proprietaire_id"
                control={control}
                rules={{ required: "Le propriétaire est requis" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger className="col-span-3 border rounded-md p-1 shadow-sm">
                      <SelectValue placeholder="Sélectionnez le proprietaire" />
                    </SelectTrigger>
                    <SelectContent
                      className={`col-span-3 ${
                        errors.proprietaire_id ? "border-red-600" : ""
                      }`}
                    >
                      <SelectGroup>
                        <SelectLabel>L'auteur</SelectLabel>
                        {proprietaires?.map((proprietaire) => (
                          <SelectItem
                            key={proprietaire.proprietaire_id}
                            value={proprietaire.proprietaire_id.toString()}
                          >
                            {proprietaire.proprietaire_nom}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.proprietaire_id && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.proprietaire_id.message}
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
