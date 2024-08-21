import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useFetchData } from "@/hooks/useFetchData.hook";
import { BookCopy, CircleSlash, ScanQrCodeIcon, User2 } from "lucide-react";
import DashoardType from "@/types/dashboard.type";
import { HashLoader } from "react-spinners";

export default function DashboardContent() {
  const dashboard_data = useFetchData<DashoardType>("/api/dashboard");

  const {
    data: dashboard,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboard_data.fetchData,
    staleTime: 1000,
  });

  const chartConfig = {
    count: {
      label: "Emprunts",
      color: "#5B99C2",
    },
  };

  return (
    <>
      {error && <div>{error.message}</div>}
      {isLoading ? (
        <div className="w-full h-[345px] flex items-center justify-center">
          <HashLoader />
        </div>
      ) : (
        <ScrollArea className="h-full">
          <div className="flex-1 space-y-4 p-4 pt-6">
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Utilisateurs
                      </CardTitle>
                      <User2 className="text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {"+ " + dashboard?.userCount}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Total des utilisateurs
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Livres
                      </CardTitle>
                      <BookCopy className="text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {"+ " + dashboard?.bookCount}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Nombre de livres
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Emprunts
                      </CardTitle>
                      <ScanQrCodeIcon className="text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {"+ " + dashboard?.empruntCount}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Nombre d'emprunts
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Sanctions
                      </CardTitle>
                      <CircleSlash className="text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {"+ " + dashboard?.sanctionCount}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Nombre de sanctions
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Histogramme</CardTitle>
                      <CardDescription>
                        Nombre d'emprunts par mois (6 derniers mois)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="m-auto">
                      {/* Charts */}
                      <ChartContainer
                        config={chartConfig}
                        className="min-h-[200px] w-full"
                      >
                        <BarChart
                          accessibilityLayer
                          data={dashboard?.empruntStats || []}
                        >
                          <CartesianGrid vertical={false} />
                          <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="count" fill="#5B99C2" radius={4} />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                  <Card className="col-span-4 md:col-span-3">
                    <CardHeader>
                      <CardTitle>Exemplaires</CardTitle>
                      <CardDescription>
                        Liste des 10 exemplaires les plus empruntés
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* <PlatPlusVendu menus={menus ?? []} /> */}
                      <div className="space-y-8">
                        {dashboard?.topExemplaires.map((exemplaire, index) => (
                          <div key={index} className="flex items-center">
                            <div className="ml-4 space-y-1">
                              <p className="text-sm font-medium leading-none capitalize">
                                {exemplaire.titre}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {exemplaire.cote + ": " + exemplaire.isbn}
                              </p>
                            </div>
                            <div className="ml-auto font-medium">
                              {exemplaire.count}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      )}
    </>
  );
}
