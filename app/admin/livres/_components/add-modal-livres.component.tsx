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
import { useCreate } from "@/hooks/useCreate.hook";
import { showToast } from "@/lib/showSwal";
import { Auteur, Livre, Proprietaire } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useFetchData } from "@/hooks/useFetchData.hook";
import InputError from "@/components/ui/input-error";

export default function AddModalLivre() {
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
  const create_livre = useCreate<Livre>("/api/livres/create", () => {
    showToast("Information", "Le livre a été créé avec succès", "success");
    queryClient.invalidateQueries({ queryKey: ["livres"] });
    setIsAddOpen(false);
  });

  const handleSubmitLivre: SubmitHandler<Livre> = async (data) => {
    const formData = new FormData();

    if (
      data.couverture &&
      (data.couverture as unknown as FileList).length > 0
    ) {
      formData.append(
        "couverture",
        (data.couverture as unknown as FileList)[0]
      );
    }

    if (
      data.livre_numerique &&
      (data.livre_numerique as unknown as FileList).length > 0
    ) {
      formData.append(
        "livre_numerique",
        (data.livre_numerique as unknown as FileList)[0]
      );
    }

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      // Utiliser result.couvertureFileName et result.livreNumeriqueFileName pour mettre à jour la base de données
      const transformedData: Livre = {
        ...data,
        nb_pages: Number(data.nb_pages),
        auteur_id: Number(data.auteur_id),
        proprietaire_id: Number(data.proprietaire_id),
        couverture: result.couvertureFileName || "", // Assure que c'est une string
        livre_numerique: result.livreNumeriqueFileName || "", // Assure que c'est une string
      };

      await create_livre.handleAdd(transformedData);
    } else {
      console.error("Erreur lors de l'upload", result);
    }
  };

  //L'état du modal
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    reset();
  }, [isAddOpen, setIsAddOpen]);

  return (
    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
      <Button onClick={() => setIsAddOpen(true)} className="">
        <CirclePlus className="h-5 w-5 mr-2" /> Ajouter un nouveau livre
      </Button>

      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajout de nouveau livre</DialogTitle>
          {/* <DialogDescription>
            Formulaire pour ajouter de nouveau livre
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
                <InputError
                  message={errors.type_livre.message}
                  classname="col-start-2 col-span-3 pl-2"
                />
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="domaine" className="text-left">
                Domaine
              </Label>
              <Controller
                name="domaine"
                control={control}
                rules={{ required: "Le domaine est requis" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="col-span-3 border border-input bg-primary rounded-full px-4 py-2">
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
                <InputError
                  message={errors.domaine.message}
                  classname="col-start-2 col-span-3 pl-2"
                />
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="couverture" className="text-left">
                Couverture
              </Label>
              <Input
                {...register("couverture", {
                  required: "La couverture est requise",
                })}
                className={`col-span-3 ${
                  errors.couverture ? "border-red-600" : ""
                }`}
                type="file"
              />
              {errors.couverture && (
                <InputError
                  message={errors.couverture.message}
                  classname="col-start-2 col-span-3 pl-2"
                />
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="livre_numerique" className="text-left">
                Livre numérique
              </Label>
              <Input
                {...register("livre_numerique")}
                type="file"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="auteur_id" className="text-left">
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
                    <SelectTrigger className="col-span-3 border border-input bg-primary rounded-full px-4 py-2">
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
                <InputError
                  message={errors.auteur_id.message}
                  classname="col-start-2 col-span-3 pl-2"
                />
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="proprietaire_id" className="text-left">
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
                    <SelectTrigger className="col-span-3 border border-input bg-primary rounded-full px-4 py-2">
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
                <InputError
                  message={errors.proprietaire_id.message}
                  classname="col-start-2 col-span-3 pl-2"
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="no-bg-destructive"
              onClick={() => {
                setIsAddOpen(false);
              }}
              className="hover:bg-red-100 rounded-full"
            >
              Annuler
            </Button>

            <Button type="submit" className="w-[90px]">
              Ajouter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
