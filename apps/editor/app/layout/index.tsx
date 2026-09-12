import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

import { AppSidebar } from "~/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { authClient } from "~/lib/auth-client";

export default function Layout() {
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ["/user/session"],
    queryFn: () => authClient.getSession(),
  });

  useEffect(() => {
    if (query.isLoading) return;
    if (query.isError || !query.data) return void navigate("/");
    // If not exist the session, redirect to login
    if (!query.data.data) return void navigate("/");
  }, [query, navigate]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-10 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Build Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-3">
          {query.isPending ? <p>Loading...</p> : <Outlet />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
