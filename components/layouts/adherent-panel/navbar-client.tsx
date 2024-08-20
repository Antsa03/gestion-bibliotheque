"use client";
import { ModeToggle } from "@/components/mode-toggle";
import LoginModal from "@/components/customs/login-modal.compent";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BookAIcon, LibraryBig, LucideHome, ScanText } from "lucide-react";
import { UserNav } from "../user-nav";
import { SheetMenu } from "./sheet-menu";
import { usePathname, useRouter } from "next/navigation";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  if (session && session.role === "Administrateur") return null;
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0 gap-5">
          <SheetMenu />
          <div className="hidden lg:flex items-center">
            <Link href="/" className="flex items-center gap-2">
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
              <div className="ml-20 flex gap-x-10">
                <Link
                  href="/"
                  className={`flex gap-x-1 items-center ${
                    pathname === "/" ? "font-bold" : ""
                  }`}
                >
                  <LucideHome className="text-xl" />
                  <span>Accueil</span>
                </Link>
                <Link
                  href="/livres"
                  className={`flex gap-x-1 items-center ${
                    pathname === "/livres" ? "font-bold" : ""
                  }`}
                >
                  <BookAIcon className="text-xl" />
                  <span>Livres</span>
                </Link>
                <Link
                  href="/emprunts"
                  className={`flex gap-x-1 items-center ${
                    pathname === "/emprunts" ? "font-bold" : ""
                  }`}
                >
                  <ScanText className="text-xl" />
                  <span>Emprunts</span>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <ModeToggle />
          {session ? <UserNav /> : <LoginModal />}
        </div>
      </div>
    </header>
  );
}
