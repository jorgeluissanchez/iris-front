import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import Evaluation from './_components/evaluation';
import { getProjectPublicQueryOptions } from '@/features/projects-public/api/get-project';


const EvaluationJuryPage = async ({ params }: { params: Promise<{ projectId: string }> }) => {

    const { projectId } = await params;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery(getProjectPublicQueryOptions( projectId ));

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <Evaluation projectId={projectId} />
        </HydrationBoundary>
    );
};

export default EvaluationJuryPage;