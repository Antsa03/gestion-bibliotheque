"use client";
import React, { useMemo, useState } from "react";
import { ContentLayout } from "@/components/layouts/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
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
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { HashLoader } from "react-spinners";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilterIcon, Download, Edit, Trash2 } from "lucide-react";

type Livre = PrismaLivre & {
  auteur: Auteur;
  proprietaire: Proprietaire;
};

function LivresPage() {
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

  const queryClient = useQueryClient();
  const delete_livre = useDelete("/api/livres/delete", () => {
    queryClient.invalidateQueries({ queryKey: ["livres"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    showToast("Information", "Le livre a été supprimé avec succès", "success");
  });

  const [isEditOpen, setIsEditOpen] = useState(false);

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

  if (isError) return <div>Erreur: {error.message}</div>;

  return (
    <ContentLayout title="Livres">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/dashboard">Tableau de bord</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Livres</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6">
        <AddModalLivre />
      </div>

      <Card className="rounded-lg border-none shadow-md mb-6">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Input
              placeholder="Rechercher par titre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Type de livre" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="max-h-60 overflow-y-auto">
                  <SelectLabel>Type du livre</SelectLabel>
                  <SelectItem value="Roman">Roman</SelectItem>
                  <SelectItem value="Nouvelle">Nouvelle</SelectItem>
                  <SelectItem value="Poésie">Poésie</SelectItem>
                  <SelectItem value="Théatre">Théatre</SelectItem>
                  <SelectItem value="Essai">Essai</SelectItem>
                  <SelectItem value="Biographie">Biographie</SelectItem>
                  <SelectItem value="Autobiographie">Autobiographie</SelectItem>
                  <SelectItem value="Documentaire">Documentaire</SelectItem>
                  <SelectItem value="Manga">Manga</SelectItem>
                  <SelectItem value="Jeunesse">Littérature jeunesse</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select value={domaineFilter} onValueChange={setDomaineFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Domaine" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="max-h-60 overflow-y-auto">
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
                  <SelectItem value="Science-fiction">
                    Science-fiction
                  </SelectItem>
                  <SelectItem value="Fantastique">Fantastique</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              onClick={resetFilters}
              variant="outline"
              className="w-full flex items-center justify-start gap-2"
            >
              <FilterIcon className="h-4 w-4" />
              <span>Réinitialiser</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg border-none shadow-md">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <HashLoader />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLivres?.map((livre) => (
                <Card
                  key={livre.livre_id}
                  className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader className="p-4">
                    <Image
                      src={IMG_BASE_URL + livre.couverture}
                      alt={`Couverture de ${livre.titre}`}
                      width={250}
                      height={250}
                      className="w-full h-64 object-cover rounded-md"
                    />
                  </CardHeader>
                  <CardContent className="flex-grow p-4">
                    <CardTitle className="text-xl mb-2">
                      {livre.titre}
                    </CardTitle>
                    <CardDescription className="text-sm mb-2">
                      <span className="line-clamp-3">{livre.description}</span>
                    </CardDescription>
                    <Separator className="my-2" />
                    <div className="text-sm space-y-1">
                      <p>Auteur: {livre.auteur.auteur_nom}</p>
                      <p>Propriétaire: {livre.proprietaire.proprietaire_nom}</p>
                      <p>Pages: {livre.nb_pages}</p>
                      <p>Type: {livre.type_livre}</p>
                      <p>Domaine: {livre.domaine}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-end gap-2">
                    {livre.livre_numerique && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              className="bg-green-500 hover:bg-green-600 text-white"
                              onClick={() =>
                                handleDownload(livre.livre_numerique)
                              }
                              size="icon"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Télécharger</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <UpdateModalLivre
                      livre={livre}
                      isEditOpen={isEditOpen}
                      setIsEditOpen={setIsEditOpen}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white"
                            onClick={() => setIsEditOpen(true)}
                            size="icon"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Modifier</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() =>
                              delete_livre.handleDelete(livre.livre_id)
                            }
                            className="bg-red-500 hover:bg-red-600 text-white"
                            size="icon"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Supprimer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </ContentLayout>
  );
}

export default LivresPage;
