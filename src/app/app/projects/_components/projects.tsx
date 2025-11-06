'use client';

import { useSearchParams } from 'next/navigation';

import { ContentLayout } from '@/components/layouts/content-layout';
import { ProjectsListByEvent } from '@/features/projects/components/projects-list-by-event';
import { ProjectsList } from '@/features/projects/components/projects-list';
import { EventsDropdown } from '@/features/projects/components/events-dropdown';
import { CreateProject } from '@/features/projects/components/create-project';

export const Projects = () => {
  const searchParams = useSearchParams();
  const eventId = searchParams?.get("event");

  return (
    <ContentLayout title="Projects">
      <div className="flex justify-end gap-2">
        <EventsDropdown />
        <CreateProject />
      </div>
      <div className="mt-4">
        {eventId ? <ProjectsListByEvent /> : <ProjectsList />}
      </div>
    </ContentLayout>
  );
};
