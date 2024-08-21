"use client";
import { cn } from "@/lib/utils";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useStore } from "@/hooks/use-store";
import { Sidebar } from "./sidebar";
import { Footer } from "./footer";
import { ModeToggle } from "@/components/mode-toggle";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "relative  min-h-[calc(100vh_-_56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        <div className="absolute top-2 right-2">
          <ModeToggle />
        </div>

        <div className="px-12 pt-1 relative w-full h-full min-h-full pb-24">
          {children}
        </div>

        <footer
          className={cn(
            "transition-[margin-left] ease-in-out duration-300 h-fit absolute bottom-0 w-full bg-background",
            sidebar?.isOpen === false ? "lg:pl-6" : ""
          )}
        >
          <Footer />
        </footer>
      </main>
    </>
  );
}
