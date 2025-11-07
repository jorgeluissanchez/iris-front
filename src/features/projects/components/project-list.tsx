"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardBody } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { useProjects } from "../api/get-projects";
import { DeleteProject } from "./delete-project";
import { UpdateProject } from "./update-project";
import { AvatarGroup } from "./avatar-icon";
import { Users, Files } from "lucide-react";

export const ProjectList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams?.get("page") ? Number(searchParams.get("page")) : 1;
  const eventId = searchParams?.get("event") || undefined;

  // useProjects maneja tanto la lista general como la filtrada por evento
  const projectsQuery = useProjects({ page, eventId });

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
    const params = new URLSearchParams();
    params.set("page", String(newPage));
    if (eventId) params.set("event", eventId);
    router.push(`?${params.toString()}`);
  };

  console.log(Date.now());

  return (
    <div className="space-y-8 px-4">
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
        {projects.map((project) => (
          <Card
            shadow="md"
            key={project.id}
            className="w-full rounded-xl border border-default-200 hover:border-primary transition-colors duration-150"
          >
            <CardBody className="p-8 space-y-6">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold tracking-tight">
                  {project.title}
                </h3>
                <p className="text-sm text-default-500 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 text-sm">
                <div className="flex items-center gap-4 w-full">
                  <div className="flex items-center text-default-400 gap-2 min-w-[100px]">
                    <Users size={18} />
                    <span>Miembros:</span>
                  </div>
                  <div className="flex-1">
                    <AvatarGroup members={project.teamMembers} size={28} />
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full">
                  <div className="flex items-center text-default-400 gap-2 min-w-[100px]">
                    <Files size={18} />
                    <span>Archivos:</span>
                  </div>
                  <div className="flex-1 font-medium">
                    {project.documentsAttached ?? 0} adjunto(s)
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-default-100">
                <div className="flex items-center gap-2 text-sm text-default-500">
                  <span>Subido el:</span>
                  <span className="font-medium">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {project.approvedAt && (
                  <div className="flex items-center gap-2 text-sm text-success-500">
                    <span>Aprobado el:</span>
                    <span className="font-medium">
                      {new Date(project.approvedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
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
