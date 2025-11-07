import { ProjectEvaluationView } from '@/features/jury/components/project-evaluation-view';

const Evaluation = ({ projectId }: { projectId: string }) => {

    return (
        <div className="container mx-auto max-w-4xl py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-balance">Project Jury</h1>
                <p className="mt-2 text-muted-foreground">Review and evaluate projects</p>
            </div>
            <ProjectEvaluationView projectId={projectId} />
        </div>
    );
};

export default Evaluation;
