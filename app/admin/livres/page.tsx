"use client";
import React, { useMemo, useState } from "react";
import AddModalLivre from "./_components/add-modal-livres.component";
import { useFetchData } from "@/hooks/useFetchData.hook";
import { Livre as PrismaLivre, Auteur, Proprietaire } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { IMG_BASE_URL } from "@/constants/img-base-url.constant";
import { useDelete } from "@/hooks/useDelete.hook";
import { showToast } from "@/lib/showSwal";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Import ShadCN UI card components
import { Button } from "@/components/ui/button"; // Import Button component if needed
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UpdateModalLivre from "./_components/update-modal-livres.component";
import { saveAs } from "file-saver";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type Livre = PrismaLivre & {
  auteur: Auteur;
  proprietaire: Proprietaire;
};

function LivresPage() {
  //Récupération des livres
  const livre_data = useFetchData<Livre[]>("/api/livres");
  const {
    data: livres,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["livres"],
    queryFn: livre_data.fetchData,
  });

  //Logique de suppression
  const queryClient = useQueryClient();
  const delete_livre = useDelete("/api/livres/delete", () => {
    queryClient.invalidateQueries({ queryKey: ["livres"] });
    showToast("Information", "Le livre a été supprimé avec succès", "success");
  });

  //L'état du modal edit
  const [isEditOpen, setIsEditOpen] = useState(false);

  //Logique de téléchargement du livre numérique
  const handleDownload = async (fileName: string | null) => {
    try {
      if (fileName) {
        const response = await fetch(`/api/download-file?fileName=${fileName}`);

        if (!response.ok) {
          throw new Error("Erreur lors du téléchargement du fichier");
        }

        const blob = await response.blob();
        saveAs(blob, fileName);
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement du fichier:", error);
      showToast("Erreur", "Le téléchargement du fichier a échoué", "error");
    }
  };

  //Logique de filtrage de livre

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [domaineFilter, setDomaineFilter] = useState("");

  const filteredLivres = useMemo(() => {
    return livres?.filter((livre) => {
      const matchesSearch = livre.titre
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "" || livre.type_livre === typeFilter;
      const matchesDomaine =
        domaineFilter === "" || livre.domaine === domaineFilter;
      return matchesSearch && matchesType && matchesDomaine;
    });
  }, [livres, searchTerm, typeFilter, domaineFilter]);

  const resetFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setDomaineFilter("");
  };

  if (isLoading) return <div>Chargement ...</div>;
  if (isError) return <div>Erreur: {error.message}</div>;

  return (
    <div className="relative h-full w-full min-h-screen">
      <div className="w-full flex justify-between mt-4 mb-4">
        <h1 className="text-2xl font-bold capitalize ">Livres</h1>
        <AddModalLivre />
      </div>

      <div className="mb-4 flex gap-4">
        <Input
          placeholder="Rechercher par titre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-72 border rounded-md p-1 shadow-sm">
            <SelectValue placeholder="Sélectionnez un type de livre" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup className="h-60">
              <SelectLabel>Type du livre</SelectLabel>
              <SelectItem value="Roman">Roman</SelectItem>
              <SelectItem value="Nouvelle">Nouvelle</SelectItem>
              <SelectItem value="Poésie">Poésie</SelectItem>
              <SelectItem value="Théatre">Théatre</SelectItem>
              <SelectItem value="Essai">Essai</SelectItem>
              <SelectItem value="Biographie">Biographie</SelectItem>
              <SelectItem value="Autobiographie">Autobiographie</SelectItem>
              <SelectItem value="Documentaire">Documentaire</SelectItem>
              <SelectItem value="Manga">Nouvelle</SelectItem>
              <SelectItem value="Jeunesse">Littérature jeunesse</SelectItem>
              <SelectItem value="Autre">Autre</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={domaineFilter} onValueChange={setDomaineFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par domaine" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup className="h-60">
              <SelectLabel>Domaine</SelectLabel>
              <SelectItem value="Narratif">Narratif</SelectItem>
              <SelectItem value="Théâtral">Théâtral</SelectItem>
              <SelectItem value="Poétique">Poétique</SelectItem>
              <SelectItem value="Scientifique">Scientifique</SelectItem>
              <SelectItem value="Philosophique">Philosophique</SelectItem>
              <SelectItem value="Religieux">Religieux</SelectItem>
              <SelectItem value="Historique">Historique</SelectItem>
              <SelectItem value="Voyage">Voyage</SelectItem>
              <SelectItem value="Horreur">Horreur</SelectItem>
              <SelectItem value="Science-fiction">Science-fiction</SelectItem>
              <SelectItem value="Fantastique">Fantastique</SelectItem>
              <SelectItem value="Autre">Autre</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button onClick={resetFilters} variant="outline">
          Réinitialiser les filtres
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-8 mt-8">
        {filteredLivres?.map((livre) => (
          <Card
            key={livre.livre_id}
            className="relative  border border-gray-200"
          >
            <CardHeader className="relative">
              <Image
                src={IMG_BASE_URL + livre.couverture}
                alt={`Couverture de ${livre.titre}`}
                width={240}
                height={240}
                className="w-full h-[240px] object-cover rounded-sm"
              />
              <span className="absolute bottom-1 right-8 text-accent-foreground font-bold">
                {livre.nb_pages} pages
              </span>
            </CardHeader>

            <CardContent className="pt-6 pb-0">
              <CardTitle>{livre.titre}</CardTitle>
              <CardDescription className="flex flex-col text-sm mt-2">
                <span className=" truncate  capitalize">
                  Description: {livre.description}
                </span>
                <span>
                  Auteur:
                  <span className="italic">{livre.auteur.auteur_nom}</span>
                </span>
                <Separator className="my-3" />
                <div className="w-full grid grid-cols-2 gap-4">
                  <span>Type: {livre.type_livre}</span>
                  <span className="text-end">Domaine: {livre.domaine}</span>
                </div>
                <span className="text-primary-foreground text-sm font-semibold">
                  Propriétaire: {livre.proprietaire.proprietaire_nom}
                </span>
                {/* <span>Pages: {livre.nb_pages}</span> */}
              </CardDescription>
            </CardContent>
            <CardFooter className="flex  justify-end gap-4 px-8 pt-0 pb-6">
              <UpdateModalLivre
                livre={livre}
                isEditOpen={isEditOpen}
                setIsEditOpen={setIsEditOpen}
              />
              <Button
                className="px-4 py-1.5"
                onClick={() => setIsEditOpen(true)}
                variant="edit"
              >
                Modifier
              </Button>
              {livre.livre_numerique && (
                <Button
                  className="px-4 py-1.5"
                  variant="download"
                  onClick={() => handleDownload(livre.livre_numerique)}
                >
                  Télécharger
                </Button>
              )}
              <Button
                type="button"
                onClick={() => delete_livre.handleDelete(livre.livre_id)}
                variant="delete"
                className="absolute top-1 right-2 p-3 translate-x-1 w-fit flex justify-center items-center rounded-full"
              >
                <X className="size-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default LivresPage;
