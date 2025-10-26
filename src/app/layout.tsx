import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
  } from '@tanstack/react-query';
  import { ReactNode } from 'react';
  import { Metadata, Viewport } from "next";
  import clsx from "clsx";
  
  import { Providers } from '@/app/provider';
  import { getUserQueryOptions } from '@/lib/auth';
  import { fontSans } from "@/config/fonts";
  
  import '@/styles/globals.css';
  
  export const metadata: Metadata = {
    title: {
      default: 'Iris',
      template: `%s - Iris`,
    },
    description: 'Iris',
    icons: {
      icon: "/favicon.ico",
    },
  };
  
  export const viewport: Viewport = {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "white" },
      { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
  };
  
  const RootLayout = async ({ children }: { children: ReactNode }) => {
    const queryClient = new QueryClient();
  
    await queryClient.prefetchQuery(getUserQueryOptions());
  
    const dehydratedState = dehydrate(queryClient);
  
    return (
      <html suppressHydrationWarning lang="es">
        <head />
        <body
          className={clsx(
            "min-h-screen text-foreground bg-background font-sans antialiased",
            fontSans.variable,
          )}
        >
          <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
            <HydrationBoundary state={dehydratedState}>
              <div className="relative flex flex-col min-h-screen">
                  {children}
              </div>
            </HydrationBoundary>
          </Providers>
        </body>
      </html>
    );
  };
  
  export default RootLayout;
  
  // We are not prerendering anything because the app is highly dynamic
  // and the data depends on the user so we need to send cookies with each request
  export const dynamic = 'force-dynamic';
  
  