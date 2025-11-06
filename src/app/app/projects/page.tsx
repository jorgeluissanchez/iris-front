import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { Projects } from "./_components/projects";

import { getProjectsByEventQueryOptions } from "@/features/projects/api/get-projects-by-event";
import { getProjectsQueryOptions } from "@/features/projects/api/get-projects";

export const metadata = {
  title: "Projects",
  description: "Projects",
};

const ProjectsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string | null; event: string | null }>;
}) => {
  const queryClient = new QueryClient();

  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1;
  const eventId = resolvedSearchParams.event;

  if (eventId) {
    await queryClient.prefetchQuery(
      getProjectsByEventQueryOptions({ eventId, page })
    );
  } else {
    await queryClient.prefetchQuery(getProjectsQueryOptions({ page }));
  }

  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <Projects />
    </HydrationBoundary>
  );
};

export default ProjectsPage;
