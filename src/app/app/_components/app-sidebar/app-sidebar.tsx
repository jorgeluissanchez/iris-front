"use client";

import * as React from "react";
import {
  GalleryVerticalEnd,
  Home,
  MessageSquare,
  Calendar,
  Users as UsersIcon,
  type LucideIcon,
  Presentation,
  ShieldCheck,
  ArrowDownAZ,
  SquareChartGantt
} from "lucide-react";

import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useUser } from "@/lib/auth";
import { paths } from "@/config/paths";
import { Link } from "@/components/ui/link";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser();

  const getMenuItems = (): {
    title: string;
    url: string;
    icon: LucideIcon;
  }[] => {
    switch (user.data?.role) {
      case "ADMIN":
        return [
          { title: "Dashboard", url: paths.app.root.getHref(), icon: Home },
          { title: "Events", url: paths.app.events.getHref(), icon: Calendar },
          {
            title: "Discussions",
            url: paths.app.discussions.getHref(),
            icon: MessageSquare,
          },

          {
            title: "Courses",
            url: paths.app.courses.getHref(),
            icon: ArrowDownAZ,
          },
          {
            title: "Projects",
            url: paths.app.projects.getHref(),
            icon: SquareChartGantt,
          },
          {
            title: "Criteria",
            url: paths.app.criteria.getHref(),
            icon: Presentation,
          },
          { title: "Juries", url: paths.app.juries.getHref(), icon: UsersIcon },
          { title: "Administrators", url: paths.app.administrators.getHref(), icon: ShieldCheck },
          { title: "Users", url: paths.app.users.getHref(), icon: UsersIcon },
        ];
      case "STUDENT":
        return [
          { title: "Dashboard", url: paths.app.root.getHref(), icon: Home },
          { title: "Events", url: paths.app.events.getHref(), icon: Calendar },
          {
            title: "Discussions",
            url: paths.app.discussions.getHref(),
            icon: MessageSquare,
          },
          // Students can view courses
          {
            title: "Courses",
            url: paths.app.courses.getHref(),
            icon: Presentation,
          },
        ];
      case "JURY":
        return [
          { title: "Dashboard", url: paths.app.root.getHref(), icon: Home },
          { title: "Events", url: paths.app.events.getHref(), icon: Calendar },
          {
            title: "Discussions",
            url: paths.app.discussions.getHref(),
            icon: MessageSquare,
          },
          {
            title: "Courses",
            url: paths.app.courses.getHref(),
            icon: Presentation,
          },
        ];
      default:
        return [
          { title: "Dashboard", url: paths.app.root.getHref(), icon: Home },
        ];
    }
  };

  const menuItems = getMenuItems();

  const data = {
    user: {
      name: user.data?.firstName + " " + user.data?.lastName,
      email: user.data?.email ?? "",
    },
    enterprise: {
      name: "Iris",
      logo: GalleryVerticalEnd,
      url: "#",
    },
  };

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
                <span className="text-base font-semibold">
                  {data.enterprise.name}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
