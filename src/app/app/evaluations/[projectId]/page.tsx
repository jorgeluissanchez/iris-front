import { ProjectEvaluationView } from '@/features/jury/components/project-evaluation-view';

export default async function EvaluatePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance">Project Evaluation</h1>
          <p className="mt-2 text-muted-foreground">Review and evaluate projects</p>
        </div>

        <ProjectEvaluationView projectId={id} />
      </div>
    </main>
  )
}