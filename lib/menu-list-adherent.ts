import { BookAIcon, LucideHome, ScanText } from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuListAdherent(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/",
          label: "Accueil",
          active: pathname.includes("/"),
          icon: LucideHome,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Navigation",
      menus: [
        {
          href: "/livres",
          label: "Livres",
          active: pathname.includes("/livres"),
          icon: BookAIcon,
          submenus: [],
        },
        {
          href: "/emprunts",
          label: "Emprunts",
          active: pathname.includes("/emprunts"),
          icon: ScanText,
          submenus: [],
        },
      ],
    },
  ];
}
