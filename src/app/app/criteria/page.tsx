import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { Criteria } from "./_components/criteria";
import { getCriteriaQueryOptions } from "@/features/cirteria/api/get-criteria";

export const metadata = {
  title: "Criteria",
  description: "Evaluation Criteria Management",
};

const CriteriaPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string | null }>;
}) => {
  const queryClient = new QueryClient();

  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1;

  await queryClient.prefetchQuery(
    getCriteriaQueryOptions({ page })
  );

  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <Criteria />
    </HydrationBoundary>
  );
};

export default CriteriaPage;

