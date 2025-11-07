"use client";

import { useSearchParams } from "next/navigation";

import { ContentLayout } from "@/components/layouts/content-layout";
import { ProjectList } from "@/features/projects/components/project-list";
import { EventsDropdown } from "@/features/projects/components/events-dropdown";
import { CreateProject } from "@/features/projects/components/create-project";

export const Projects = () => {
  const searchParams = useSearchParams();
  const eventId = searchParams?.get("event");

  return (
    <ContentLayout title="Projects">
      <div className="flex justify-between items-center">
        <EventsDropdown />
        <CreateProject />
      </div>
      <div className="mt-4">
        <ProjectList />
      </div>
    </ContentLayout>
  );
};
