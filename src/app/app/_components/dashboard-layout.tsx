"use client";

import {
  Home,
  Folder,
  Users,
  User2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import NextLink from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";

import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import {
  Dropdown as HeroUIDropdown,
  DropdownTrigger as HeroUIDropdownTrigger,
  DropdownMenu as HeroUIDropdownMenu,
  DropdownItem as HeroUIDropdownItem,
} from "@heroui/dropdown";
import { Link } from "@/components/ui/link";
import { paths } from "@/config/paths";
import { useLogout, useUser } from "@/lib/auth";
import { cn } from "@/utils/cn";
import { UserDropdown } from "./user-dropdown";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Breadcrumbs, BreadcrumbItem, Divider } from "@heroui/react";

type SideNavigationItem = {
  name: string;
  to: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

const Logo = () => {
  return (
    <div className="shadow-lg shadow-white  rounded-xl pt-2 pb-2 pl-5 pr-5 p bg-gradient-to-r from-slate-50 to-slate-900">
      <Link
        className="flex items-center text-white "
        href={paths.home.getHref()}
      >
        <img
          className="h-8 w-auto"
          src="/logoUninorte.png"
          alt="logoUninorte"
        />
        <span className="text-sm font-semibold text-white">IRIS</span>
      </Link>
    </div>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout({
    onSuccess: () => router.push(paths.auth.login.getHref(pathname)),
  });
  const navigation = [
    { name: "Dashboard", to: paths.app.root.getHref(), icon: Home },
    { name: "Discussions", to: paths.app.discussions.getHref(), icon: Folder },
    user.data?.role === "ADMIN" && {
      name: "Users",
      to: paths.app.users.getHref(),
      icon: Users,
    },
  ].filter(Boolean) as SideNavigationItem[];

  return (
    <div className="flex h-screen w-screen flex-row">
      <aside className="flex flex-col justify-between">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Divider
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumbs>
                <BreadcrumbItem className="hidden md:block">
                  Building Your Application
                </BreadcrumbItem>
                <Divider />
                <BreadcrumbItem>aaa</BreadcrumbItem>
              </Breadcrumbs>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
              </div>
              <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
            </div>
          </SidebarInset>
        </SidebarProvider>
        <nav className="flex flex-col items-center gap-4 px-2 py-4 ">
          <div className="flex flex-row space-around items-center justify-between w-full mb-8">
            <Logo />
            <button>
              <ChevronLeft />
            </button>
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.to;
            return (
              <NextLink
                key={item.name}
                href={item.to}
                className={cn(
                  "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "group flex flex-1 w-full items-center rounded-md p-2 text-base font-medium",
                  isActive && "bg-gray-900 text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "text-gray-400 group-hover:text-gray-300",
                    "mr-4 size-6 shrink-0"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </NextLink>
            );
          })}
        </nav>
        <div>
          <UserDropdown />
        </div>
      </aside>

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:justify-end sm:border-0 sm:bg-transparent sm:px-6">
          {/* <Progress /> */}
          <Drawer title="Menu" className="bg-black text-white sm:max-w-60">
            <nav className="grid gap-6 text-lg font-medium">
              <div className="flex h-16 shrink-0 items-center px-4">
                <Logo />
              </div>
              {navigation.map((item) => {
                const isActive = pathname === item.to;
                return (
                  <NextLink
                    key={item.name}
                    href={item.to}
                    className={cn(
                      "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "group flex flex-1 w-full items-center rounded-md p-2 text-base font-medium",
                      isActive && "bg-gray-900 text-white"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "text-gray-400 group-hover:text-gray-300",
                        "mr-4 size-6 shrink-0"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </NextLink>
                );
              })}
            </nav>
          </Drawer>
          <HeroUIDropdown>
            <HeroUIDropdownTrigger>
              <Button
                variant="bordered"
                size="sm"
                className="overflow-hidden rounded-full"
              >
                <span className="sr-only">Open user menu</span>
                <User2 className="size-6 rounded-full" />
              </Button>
            </HeroUIDropdownTrigger>
            <HeroUIDropdownMenu>
              <HeroUIDropdownItem
                key="profile"
                onClick={() => router.push(paths.app.profile.getHref())}
                className={cn("block px-4 py-2 text-sm text-gray-700")}
              >
                Your Profile
              </HeroUIDropdownItem>
              <HeroUIDropdownItem
                key="logout"
                className={cn("block px-4 py-2 text-sm text-gray-700 w-full")}
                onClick={() => logout.mutate()}
              >
                Sign Out
              </HeroUIDropdownItem>
            </HeroUIDropdownMenu>
          </HeroUIDropdown>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
};

function Fallback({ error }: { error: Error }) {
  return <p>Error: {error.message ?? "Something went wrong!"}</p>;
}

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  return (
    <Layout>
      <ErrorBoundary key={pathname} FallbackComponent={Fallback}>
        {children}
      </ErrorBoundary>
    </Layout>
  );
};
