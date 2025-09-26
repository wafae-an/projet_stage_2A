"use client"

import * as React from "react"
import { BarChart3, FileText, MailPlus, UserCog,LogOut } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { FormsVisualization } from "@/components/forms-visualization"
import { ExpertRecruitment } from "@/components/expert-recruitment"
import ExpertInvitations from "@/components/expert_invitation"
import { FormsVisualization_2 } from "@/components/forms-visualization_1"
import { logout } from "@/actions/logout"

const navigationItems = [
  {
    title: "Détails des formulaires",
    icon: FileText,
    id: "forms",
  },
   {
    title: "Détails des formulaires_2",
    icon: FileText,
    id: "forms2",
  },
  {
    title: "Recrutement des experts",
    icon: UserCog,
    id: "experts",
  },
  {
    title: "Invitations des experts",
    icon: MailPlus ,
    id: "invitations",
  },
]

export function CNRSTDashboard() {
  const [activeTab, setActiveTab] = React.useState("forms")

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-4">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BarChart3 className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-semibold">CNRST</span>
              <span className="text-xs text-muted-foreground">Plateforme de visualisation</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton isActive={activeTab === item.id} onClick={() => setActiveTab(item.id)}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <button
              onClick={logout}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </button>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">
  {activeTab === "forms"
    ? "Détails des formulaires de candidatures & évaluations "
    : activeTab === "experts"
    ? " Détails des formulaires de Recrutement des experts"
    : "Détails des invitations pour les comptes des experts"}
</h1>

        </header>
       <div className="flex-1 p-6">
  {activeTab === "forms" && <FormsVisualization />}
  {activeTab === "forms2" && <FormsVisualization_2/>}
  {activeTab === "experts" && <ExpertRecruitment />}
  {activeTab === "invitations" && < ExpertInvitations/>}
</div>

      </SidebarInset>
    </SidebarProvider>
  )
}
