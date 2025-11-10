"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardBody } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { useProjects } from "../api/get-projects";
import { useUpdateProject } from "../api/update-project";
import { DeleteProject } from "./delete-project";
import { UpdateProject } from "./update-project";
import { AvatarGroup } from "./avatar-icon";
import { Users, Files, FileText } from "lucide-react";

export const ProjectList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams?.get("page") ? Number(searchParams.get("page")) : 1;
  const eventId = searchParams?.get("event") || undefined;
  const stateFilter = (searchParams?.get("state") as
    | "UNDER_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | undefined) || undefined;

  // useProjects maneja tanto la lista general como la filtrada por evento
  const projectsQuery = useProjects({ page, eventId });
  const updateProjectMutation = useUpdateProject();

  if (projectsQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  let projects = projectsQuery.data?.data;
  if (projects && stateFilter) {
    projects = projects.filter((p) => p.state === stateFilter);
  }
  const meta = projectsQuery.data?.meta;

  if (!projects) return null;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("page", String(newPage));
    if (eventId) params.set("event", eventId);
    if (stateFilter) params.set("state", stateFilter);
    router.push(`?${params.toString()}`);
  };

  const handleStateFilterChange = (value: string | null) => {
    const params = new URLSearchParams();
    params.set("page", "1"); // reset page when changing filter
    if (eventId) params.set("event", eventId);
    if (value) {
      params.set("state", value);
    }
    router.push(`?${params.toString()}`);
  };

  const handleApprove = (projectId: string) => {
    updateProjectMutation.mutate({ projectId, data: { state: "APPROVED" } });
  };

  const handleReject = (projectId: string) => {
    updateProjectMutation.mutate({ projectId, data: { state: "REJECTED" } });
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* State Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs sm:text-sm font-medium text-muted-foreground w-full sm:w-auto">
          Filtrar por estado:
        </span>
        <Button
          size="sm"
          variant={stateFilter ? "ghost" : "solid"}
          onPress={() => handleStateFilterChange(null)}
        >
          Todos
        </Button>
        <Button
          size="sm"
          variant={stateFilter === "UNDER_REVIEW" ? "solid" : "ghost"}
          onPress={() => handleStateFilterChange("UNDER_REVIEW")}
        >
          En revisión
        </Button>
        <Button
          size="sm"
          variant={stateFilter === "APPROVED" ? "solid" : "ghost"}
          onPress={() => handleStateFilterChange("APPROVED")}
        >
          Aprobados
        </Button>
        <Button
          size="sm"
          variant={stateFilter === "REJECTED" ? "solid" : "ghost"}
          onPress={() => handleStateFilterChange("REJECTED")}
        >
          Rechazados
        </Button>
      </div>
      <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 lg:grid-cols-2">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="glass-card w-full rounded-xl border border-default-200 hover:border-primary transition-colors duration-150"
          >
            <CardBody className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-balance">{project.name}</h3>
                  {project.description && (
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">{project.description}</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
                  <div className="flex items-center text-default-400 gap-2 text-sm sm:text-base">
                    <Users size={16} className="sm:w-[18px] sm:h-[18px]" />
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

                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Documents: {project.documents?.length || 0} file(s) attached</span>
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
                    <span className="block w-full text-center text-xs font-medium px-2 py-1 rounded bg-secondary/40">
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
