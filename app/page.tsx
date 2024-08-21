"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Calendar, Search } from "lucide-react";
import RegisterModal from "@/components/customs/register-modal.component";
import { useFetchData } from "@/hooks/useFetchData.hook";
import { Livre } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { IMG_BASE_URL } from "@/constants/img-base-url.constant";
import { GridLoader } from "react-spinners";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  //L'état du modal d'inscription
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  //Récupération de quelques livres
  const livre_data = useFetchData<Livre[]>("/api/couvertures");
  const {
    data: livres,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["livres"],
    queryFn: livre_data.fetchData,
  });

  useEffect(() => {
    if (session && session.role === "Administrateur") {
      router.push("/admin/dashboard");
    }
  }, [session, router]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="container relative pb-10">
          <section className="mx-auto flex max-w-[980px] flex-col items-center gap-4 py-12 md:py-16 lg:py-24">
            <h1 className="text-center text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
              Bienvenue sur BiblioTech
            </h1>
            <p className="max-w-[750px] text-center text-xl text-muted-foreground">
              Votre plateforme intelligente pour la gestion de bibliothèque
            </p>
            <div className="flex gap-4 mt-6">
              <RegisterModal
                isRegisterOpen={isRegisterOpen}
                setIsRegisterOpen={setIsRegisterOpen}
              />
              <Button
                size="lg"
                className="text-xl font-light"
                onClick={() => setIsRegisterOpen(true)}
              >
                S'inscrire
              </Button>
            </div>
          </section>

          <div className="w-full flex justify-center relative mb-16">
            <Image
              src="/pexels-pixabay-256559.jpg"
              width={1200}
              height={600}
              alt="Bibliothèque moderne"
              priority
              className="rounded-xl shadow-lg"
            />
          </div>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                title: "Vaste Collection",
                icon: BookOpen,
                description:
                  "Accédez à des milliers de livres, e-books et ressources numériques.",
              },
              {
                title: "Gestion Facile",
                icon: Users,
                description: "Gérez facilement les emprunts et retours.",
              },
              {
                title: "Événements",
                icon: Calendar,
                description:
                  "Participez à nos clubs de lecture et ateliers culturels.",
              },
              {
                title: "Recherche",
                icon: Search,
                description:
                  "Trouvez rapidement ce que vous cherchez avec notre moteur de recherche.",
              },
            ].map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <feature.icon className="h-6 w-6" />
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Découvrez notre collection
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Explorez nos dernières acquisitions et best-sellers
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-center justify-center">
              {isError && <p>{error.message}</p>}
              {isLoading ? (
                <GridLoader />
              ) : (
                <>
                  {livres?.map((livre) => (
                    <Card
                      key={livre.livre_id}
                      className="shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                    >
                      <CardHeader className="p-0">
                        <Image
                          src={IMG_BASE_URL + livre.couverture}
                          alt={`Couverture de ${livre.titre}`}
                          width={250}
                          height={250}
                          className="w-full h-64 object-cover rounded-t-sm"
                        />
                      </CardHeader>
                      <CardContent className="p-4">
                        <CardTitle className="text-lg font-semibold">
                          {livre.titre}
                        </CardTitle>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
