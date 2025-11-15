"use client"

import { Card, CardBody } from "@/components/ui/card"
import { FileText, Users, ArrowLeft } from "lucide-react"
import { Button } from "@heroui/button"
import { paths } from "@/config/paths"
import { useJuryProjects } from "@/features/projects-public/api/get-jury-project"
import { Spinner } from "@/components/ui/spinner"
import { AvatarGroup } from "@/features/projects/components/avatar-icon"
import { useRouter } from "next/navigation"

type ProjectListViewProps = {
    eventId: string;
};

export function ProjectListView({ eventId }: ProjectListViewProps) {
    const router = useRouter();

    const { data, isLoading } = useJuryProjects({
        page: 1,
        eventId: eventId,
    });

    const projects = data?.data || [];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Spinner size="lg" />
            </div>
        )
    }

    if (projects.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No hay proyectos asignados
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div>
                <Button
                    variant="light"
                    className="gap-2"
                    onClick={() => router.push('/app')}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
            </div>
            <div className="grid gap-6 p-8 sm:grid-cols-1 lg:grid-cols-2">
                {projects.map((project) => (
                    <Card
                        key={project.id}
                        className="glass-card w-full rounded-xl border border-default-200 hover:border-primary transition-all duration-150 hover:scale-[1.01]"
                    >
                        <CardBody className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-balance">{project.name}</h3>
                                        {project.description && (
                                            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                                        )}
                                    </div>
                                    {project.eventNumber && (
                                        <div className="flex-shrink-0">
                                            <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                                                #{project.eventNumber}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 w-full">
                                    <div className="flex items-center text-default-400 gap-2 min-w-[100px]">
                                        <Users size={18} />
                                        <span>Miembros:</span>
                                    </div>
                                    <div className="flex-1">
                                        <AvatarGroup
                                            members={project.participants.map(p => ({
                                                ...p,
                                                name: `${p.firstName} ${p.lastName}`
                                            }))}
                                            size={28}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <FileText className="h-4 w-4" />
                                    <span>Documents: {project.documents?.length || 0} file(s) attached</span>
                                </div>
                            </div>
                            <Button
                                className="mt-6 w-full transition-transform hover:scale-[1.01]"
                                color="primary"
                                onPress={() => router.push(paths.app.evaluations.getHref(project.id.toString()))}
                            >Evaluate Project</Button>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    )
}
