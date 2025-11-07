import { ProjectListView } from "@/features/jury/components/project-list-view";

export default async function ProjectJuryPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = await params;

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance">Project Jury</h1>
          <p className="mt-2 text-muted-foreground">Review and evaluate projects</p>
        </div>

        <ProjectListView />
      </div>
    </main>
  )
}