import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { Juries } from "./_components/Juries";

import { getJuriesQueryOptions } from "@/features/juries/api/get-juries";
import { RoleGuard } from "@/components/auth/role-guard";

export const metadata = {
  title: "Juries",
  description: "Juries",
};

const JuriesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string | null }>;
}) => {
  const queryClient = new QueryClient();

  const resolvedSearchParams = await searchParams;

  await queryClient.prefetchQuery(
    getJuriesQueryOptions({
      page: resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1,
    })
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <RoleGuard roles={['ADMIN']}>
      <HydrationBoundary state={dehydratedState}>
        <Juries />
      </HydrationBoundary>
    </RoleGuard>
  );
};

export default JuriesPage;
