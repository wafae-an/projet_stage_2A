"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Users, Building2,UserCog,LogOut } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { logout } from "@/actions/logout"

const menuItems = [
  {
    title: "Gestion des comptes",
    url: "/admin/accounts",
    icon:UserCog,
  },
  {
    title: "Affectation des organisations",
    url: "/admin/organizations",
    icon: Building2,
    
  },
  {
    title: "Détails des utilisateurs",
    url: "/admin/details_utilisateurs",
    icon:  Users,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Users className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">Administration</span>
            <span className="text-xs text-sidebar-foreground/70">Espace Admin</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <Link href={item.url} passHref legacyBehavior>
                    <SidebarMenuButton as="a" isActive={pathname === item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
       <div className="w-full px-4 pb-4">
    <button
      onClick={logout}
      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      Se déconnecter
    </button>
  </div>
      
    </Sidebar>
  )
}
