import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import Project from './_components/project';
import { getJuryProjectsQueryOptions } from '@/features/projects-public/api/get-jury-project';

const ProjectJuryPage = async ({ params }: { params: Promise<{ eventId: string }> }) => {

    const { eventId } = await params;
    
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery(getJuryProjectsQueryOptions({ eventId }));

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <Project eventId={eventId} />
        </HydrationBoundary>
    );
};

export default ProjectJuryPage;