"use client";

import { ChevronDown, EllipsisVertical, LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useEffect, useState } from "react";

import {
  menuItems,
  filterMenuByRole,
  UserRole,
} from "@/constants/menu-constant";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { cmsApi } from "@/lib/api";
import { LogoutDialog } from "@/app/(auth)/login/_components/logout-dialog";
import { usePathname } from "next/navigation";

interface MeUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export function AppSidebar() {
  const { isMobile } = useSidebar();
  const [user, setUser] = useState<MeUser | null>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await cmsApi.get<MeUser>("/me");
        setUser(data);
      } catch {
        setUser(null);
      }
    };

    fetchMe();
  }, []);

  const filteredMenuItems = user ? filterMenuByRole(menuItems, user.role) : [];

  const isActive = (url: string, exact = false) => {
    if (exact) return pathname === url;
    return pathname === url || pathname.startsWith(url + "/");
  };

  const hasActiveSubMenu = (subMenu?: { url: string }[]) => {
    return subMenu?.some((sub) => isActive(sub.url, true)) ?? false;
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <div className="font-semibold">LGSM CMS</div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredMenuItems.map((item) => {
                  if (item.subMenu && item.subMenu.length > 0) {
                    const subIsActive = hasActiveSubMenu(item.subMenu);

                    return (
                      <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={subIsActive}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              tooltip={item.title}
                              isActive={subIsActive}
                            >
                              <item.icon />
                              <span>{item.title}</span>
                              <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.subMenu.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isActive(subItem.url, true)}
                                  >
                                    <a href={subItem.url}>
                                      <span>{subItem.title}</span>
                                    </a>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild suppressHydrationWarning>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    suppressHydrationWarning
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-primary">
                        {user?.name?.charAt(0) ?? "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="leading-tight" suppressHydrationWarning>
                      <h4 className="text-sm truncate font-medium">
                        {user?.name ?? "Loading..."}
                      </h4>
                      <span className="text-xs text-muted-foreground truncate capitalize">
                        {user?.role ?? ""}
                      </span>
                    </div>
                    <EllipsisVertical className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="min-w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg bg-primary">
                          {user?.name?.charAt(0) ?? "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="leading-tight">
                        <h4 className="text-sm truncate font-medium">
                          {user?.name ?? "Loading..."}
                        </h4>
                        <span className="text-xs text-muted-foreground capitalize">
                          {user?.role ?? ""}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setShowLogoutDialog(true)}>
                      <LogOut />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <LogoutDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
      />
    </>
  );
}
