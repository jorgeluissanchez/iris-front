import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { Administrators } from "./_components/Administrators";

import { getAdministratorsQueryOptions } from "@/features/administrators/api/get-administrators";

export const metadata = {
  title: "Administrators",
  description: "Administrators",
};

const AdministratorsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string | null }>;
}) => {
  const queryClient = new QueryClient();

  const resolvedSearchParams = await searchParams;

  await queryClient.prefetchQuery(
    getAdministratorsQueryOptions({
      page: resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1,
    })
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Administrators />
    </HydrationBoundary>
  );
};

export default AdministratorsPage;

