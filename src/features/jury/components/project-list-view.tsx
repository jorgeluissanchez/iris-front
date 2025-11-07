"use client"

import { Badge } from "@heroui/badge"
import { Card, CardBody } from "@/components/ui/card"
import { FileText, Users, CheckCircle2 } from "lucide-react"
import { Button } from "@heroui/button"
import { paths } from "@/config/paths"
import { useSearchParams, useRouter } from "next/navigation";


const projects = [
    {
        id: 1,
        title: "Smart Campus Navigation System",
        description: "An AI-powered mobile app for indoor navigation across campus buildings",
        teamMembers: 4,
        additionalMembers: 4,
        documents: 3,
        submittedDate: "3/1/2025",
        approvedDate: "14/2/2025",
        status: "Approved",
    },
    {
        id: 2,
        title: "Smart Campus Navigation System",
        description: "An AI-powered mobile app for indoor navigation across campus buildings",
        teamMembers: 4,
        additionalMembers: 4,
        documents: 3,
        submittedDate: "3/1/2025",
        approvedDate: "14/2/2025",
        status: "Approved",
    },
    {
        id: 3,
        title: "Smart Campus Navigation System",
        description: "An AI-powered mobile app for indoor navigation across campus buildings",
        teamMembers: 4,
        additionalMembers: 4,
        documents: 3,
        submittedDate: "3/1/2025",
        approvedDate: "14/2/2025",
        status: "Approved",
    },
    {
        id: 4,
        title: "Smart Campus Navigation System",
        description: "An AI-powered mobile app for indoor navigation across campus buildings",
        teamMembers: 4,
        additionalMembers: 4,
        documents: 3,
        submittedDate: "3/1/2025",
        approvedDate: "14/2/2025",
        status: "Approved",
    },
]

export function ProjectListView() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    return (
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {projects.map((project) => (
                <Card
                    key={project.id}
                    className="overflow-hidden border-border bg-card transition-colors hover:border-primary/50"
                >
                    <CardBody className="p-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-balance">{project.title}</h3>
                                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Team members:</span>
                                <div className="flex items-center -space-x-2">
                                    {Array.from({ length: project.teamMembers }).map((_, index) => (
                                        <div
                                            key={index}
                                            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-medium text-muted-foreground"
                                        >
                                            U{index + 1}
                                        </div>
                                    ))}
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-medium text-muted-foreground">
                                        +{project.additionalMembers}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                <span>Documents: {project.documents} file(s) attached</span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="text-muted-foreground">
                                    Submitted on: {project.submittedDate} • Approved on {project.approvedDate}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Badge variant="shadow" className="flex items-center gap-1.5">
                                        <CheckCircle2 className="h-3 w-3" />
                                    </Badge>
                                    {project.status}
                                </div>
                            </div>
                        </div>
                        <Button
                            className="mt-6 w-full"
                            onClick={() => router.push(paths.app.evaluations.getHref(project.id.toString()))}
                        >Evaluate Project</Button>
                    </CardBody>
                </Card>
            ))}
        </div>
    )
}
