import {
  User,
  LayoutGrid,
  SendToBack,
  Pen,
  UserPen,
  Book,
  BookPlus,
  TriangleAlert,
} from "lucide-react";

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

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/admin/dashboard",
          label: "Tableau de bord",
          active: pathname.includes("/admin/dashboard"),
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Navigation",
      menus: [
        {
          href: "/admin/utilisateurs",
          label: "Utilisateurs",
          active: pathname.includes("/admin/utilisateurs"),
          icon: User,
          submenus: [],
        },
        {
          href: "/admin/auteurs",
          label: "Auteurs",
          active: pathname.includes("/admin/auteurs"),
          icon: Pen,
          submenus: [],
        },
        {
          href: "/admin/proprietaires",
          label: "Propriétaires",
          active: pathname.includes("/admin/proprietaires"),
          icon: UserPen,
          submenus: [],
        },
        {
          href: "/admin/livres",
          label: "Livres",
          active: pathname.includes("/admin/livres"),
          icon: Book,
          submenus: [],
        },
        {
          href: "/admin/exemplaires",
          label: "Exemplaires",
          active: pathname.includes("/admin/exemplaires"),
          icon: BookPlus,
          submenus: [],
        },
        {
          href: "/admin/emprunts",
          label: "Emprunts",
          active: pathname.includes("/admin/emprunts"),
          icon: SendToBack,
          submenus: [],
        },
        {
          href: "/admin/sanctions",
          label: "Sanctions",
          active: pathname.includes("/admin/sanctions"),
          icon: TriangleAlert,
          submenus: [],
        },
      ],
    },
  ];
}
