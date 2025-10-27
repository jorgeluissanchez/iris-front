"use client"

import * as React from "react"
import {
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Shield,
  Users,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useUser } from "@/lib/auth";
import { paths } from "@/config/paths"
import { Link } from "@/components/ui/link"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser();
  const data = {
    user: {
      name: user.data?.firstName + " " + user.data?.lastName,
      email: user.data?.email ?? ""
    },
    enterprise: {
      name: "Iris",
      logo: GalleryVerticalEnd,
      url: "#",
    },
    navMain: user.data?.role === 'ADMIN' ? [{
      title: "Admin",
      url: "#",
      icon: Shield,
      items: [
        {
          title: "Dashboard",
          url: paths.app.root.getHref(),
        },
        {
          title: "Discussions",
          url: paths.app.discussions.getHref(),
        },
        {
          title: "Users",
          url: paths.app.users.getHref(),
        },
      ],
    }] : [{
      title: "User",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Dashboard",
          url: paths.app.root.getHref(),
        },
        {
          title: "Discussions",
          url: paths.app.discussions.getHref(),
        },
      ],
    }],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href={data.enterprise.url}>
                <data.enterprise.logo className="!size-5" />
                <span className="text-base font-semibold">{data.enterprise.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
