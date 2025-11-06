"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";

import { Spinner } from "@/components/ui/spinner";
import { Card, CardBody } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { useProjects } from "../api/get-projects";

import { DeleteProject } from "./delete-project";
import { UpdateProject } from "./update-project";

export const ProjectsList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams?.get("page") ? Number(searchParams.get("page")) : 1;

  const projectsQuery = useProjects({
    page: page,
  });

  if (projectsQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const projects = projectsQuery.data?.data;
  const meta = projectsQuery.data?.meta;

  if (!projects) return null;

  const handlePageChange = (newPage: number) => {
    router.push(`?page=${newPage}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card shadow="sm" key={project.id}>
            <CardBody className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p className="text-sm text-default-500">{project.description}</p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <div className="text-default-400">Miembros:</div>
                  <div className="font-medium">
                    {project.teamMembers?.length ?? 0}
                  </div>
                </div>
                <div>
                  <div className="text-default-400">Archivos:</div>
                  <div className="font-medium">
                    {project.documentsAttached ?? 0}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <div className="text-default-400">Estado entrega:</div>
                  <div className="font-medium">
                    {project.submittedAt ? "Enviado" : "No enviado"}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <UpdateProject projectId={project.id} />
                <DeleteProject id={project.id} />
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
