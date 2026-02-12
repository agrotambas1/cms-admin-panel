import {
  Calendar,
  Home,
  Image,
  Inbox,
  Newspaper,
  Settings,
  Users,
  FolderKanban,
  LayoutDashboard,
  FolderCheck,
  Building2,
  Boxes,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export type UserRole =
  | "ADMIN"
  | "MARKETING_EDITOR"
  | "TECHNICAL_EDITOR"
  | "VIEWER";

export interface SubMenuItem {
  title: string;
  url: string;
  allowedRoles: UserRole[];
}

export interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  allowedRoles: UserRole[];
  subMenu?: SubMenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    allowedRoles: ["ADMIN", "MARKETING_EDITOR", "TECHNICAL_EDITOR", "VIEWER"],
  },
  {
    title: "Services",
    url: "/services",
    icon: FolderCheck,
    allowedRoles: ["ADMIN", "MARKETING_EDITOR", "TECHNICAL_EDITOR", "VIEWER"],
  },
  {
    title: "Industries",
    url: "/industries",
    icon: Building2,
    allowedRoles: ["ADMIN", "MARKETING_EDITOR", "TECHNICAL_EDITOR", "VIEWER"],
  },
  {
    title: "Articles",
    url: "/articles",
    icon: Newspaper,
    allowedRoles: ["ADMIN", "MARKETING_EDITOR", "TECHNICAL_EDITOR", "VIEWER"],
    subMenu: [
      {
        title: "All Articles",
        url: "/articles",
        allowedRoles: [
          "ADMIN",
          "MARKETING_EDITOR",
          "TECHNICAL_EDITOR",
          "VIEWER",
        ],
      },
      {
        title: "Categories",
        url: "/articles/categories",
        allowedRoles: [
          "ADMIN",
          "MARKETING_EDITOR",
          "TECHNICAL_EDITOR",
          "VIEWER",
        ],
      },
      {
        title: "Tags",
        url: "/articles/tags",
        allowedRoles: [
          "ADMIN",
          "MARKETING_EDITOR",
          "TECHNICAL_EDITOR",
          "VIEWER",
        ],
      },
    ],
  },
  {
    title: "Case Studies",
    url: "/case-studies",
    icon: FolderKanban,
    allowedRoles: ["ADMIN", "MARKETING_EDITOR", "TECHNICAL_EDITOR", "VIEWER"],
  },
  {
    title: "Events",
    url: "/events",
    icon: Calendar,
    allowedRoles: ["ADMIN", "MARKETING_EDITOR", "TECHNICAL_EDITOR", "VIEWER"],
  },
  // {
  //   title: "Banners",
  //   url: "/banners",
  //   icon: Image,
  //   allowedRoles: ["ADMIN", "MARKETING_EDITOR", "TECHNICAL_EDITOR", "VIEWER"],
  // },
  {
    title: "Media",
    url: "/media",
    icon: Inbox,
    allowedRoles: ["ADMIN", "MARKETING_EDITOR", "TECHNICAL_EDITOR", "VIEWER"],
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
    allowedRoles: ["ADMIN"],
  },
  // {
  //   title: "Settings",
  //   url: "/settings",
  //   icon: Settings,
  //   allowedRoles: ["ADMIN", "MARKETING_EDITOR", "TECHNICAL_EDITOR", "VIEWER"],
  // },
];

export const hasRole = (
  userRole: UserRole,
  allowedRoles: UserRole[],
): boolean => {
  return allowedRoles.includes(userRole);
};

export const filterMenuByRole = (
  menus: MenuItem[],
  userRole: UserRole,
): MenuItem[] => {
  return menus
    .filter((menu) => hasRole(userRole, menu.allowedRoles))
    .map((menu) => {
      if (menu.subMenu) {
        return {
          ...menu,
          subMenu: menu.subMenu.filter((subItem) =>
            hasRole(userRole, subItem.allowedRoles),
          ),
        };
      }
      return menu;
    });
};
