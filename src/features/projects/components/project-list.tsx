"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardBody } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { useProjects } from "../api/get-projects";
import { ApproveProjectModal } from "./approve-modal";
import { RejectProjectModal } from "./reject-modal";

export const ProjectList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams?.get("page") ? Number(searchParams.get("page")) : 1;
  const eventId = searchParams?.get("event") ? Number(searchParams.get("event")) : undefined;

  const projectsQuery = useProjects({ page, eventId });

  const projects = projectsQuery.data?.data;
  const meta = projectsQuery.data?.meta;

  if (!eventId) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Por favor selecciona un evento para ver los proyectos.
      </div>
    );
  }

  if (projectsQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No hay proyectos para este evento.
      </div>
    );
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("page", String(newPage));
    if (eventId) params.set("event", String(eventId));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 lg:grid-cols-2">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="glass-card w-full rounded-xl border border-default-200 hover:border-primary transition-colors duration-150"
          >
            <CardBody className="p-4 sm:p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold">{project.name}</h3>
                  {project.description && (
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                    <ApproveProjectModal projectId={project.id} />

                   <RejectProjectModal projectId={project.id} />
                </div>
              </div>

              <div className="w-full pt-3 space-y-2">
                {project.state === "UNDER_REVIEW" && (
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <Button
                      size="sm"
                      color="success"
                      className="w-full text-xs sm:text-sm"
                      isDisabled={updateProjectMutation.isPending}
                      onPress={() => handleApprove(project.id)}
                    >
                      Aprobar
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      className="w-full text-xs sm:text-sm"
                      isDisabled={updateProjectMutation.isPending}
                      onPress={() => handleReject(project.id)}
                    >
                      Rechazar
                    </Button>
                  </div>
                )}
                {project.state !== "UNDER_REVIEW" && (
                  <div className="w-full space-y-2">
                    <span 
                      className="block w-full text-center text-xs font-medium px-2 py-1 rounded"
                      style={{
                        backgroundColor: project.state === "APPROVED" 
                          ? "oklch(0.75 0.15 195 / 0.8)" 
                          : "oklch(0.82 0.18 330 / 0.4)",
                      }}
                    >
                      {project.state === "APPROVED" && "Aprobado"}
                      {project.state === "REJECTED" && "Rechazado"}
                    </span>
                    <UpdateProject projectId={project.id} />
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            total={meta.totalPages}
            page={page}
            onChange={handlePageChange}
            showControls
          />
        </div>
      )}
    </div>
  );
};
