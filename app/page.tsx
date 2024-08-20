"use client";
import Image from "next/image";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession(); // Get session data
  const router = useRouter();

  useEffect(() => {
    // Check if the user is an administrator and redirect if necessary
    if (session && session.role === "Administrateur") {
      router.push("/admin/dashboard");
    }
  }, [session, router]);
  return (
    <div className="flex flex-col min-h-screen">
      <main className="min-h-[calc(100vh-57px-97px)] flex-1">
        <div className="container relative pb-10">
          <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-6">
            <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
              Bienvenue sur le platforme
            </h1>
            <span className="max-w-[750px] text-center text-lg font-light text-foreground">
              Une application pour la gestion de bibliothèque
            </span>
          </section>
          <div className="w-full flex justify-center relative">
            <Image
              src="/pexels-pixabay-256559.jpg"
              width={1080}
              height={608}
              alt="demo-dark"
              priority
              className="rounded-xl shadow-sm opacity-65"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
