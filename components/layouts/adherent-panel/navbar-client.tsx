"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "./user-nav";
import LoginModal from "@/components/customs/login-modal.compent";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LibraryBig } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  if (session && session.role === "Administrateur") return null;
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0 gap-5">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            {/* Logo de l'application */}
            <LibraryBig className="w-6 h-6 mr-1" />
            <h1
              className={cn(
                "font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] "
              )}
            >
              Bibliothèque
            </h1>
          </Link>
          {session && (
            <>
              <Link href="/">Accueil</Link>
              <Link href="/livres">Livres</Link>
              <Link href="/emprunts">Emprunts</Link>
            </>
          )}
        </div>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <ModeToggle />
          {session ? <UserNav /> : <LoginModal />}
        </div>
      </div>
    </header>
  );
}
