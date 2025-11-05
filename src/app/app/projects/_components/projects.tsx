"use client";

import { ContentLayout } from "@/components/layouts/content-layout";
import SelectEventsComponent from "@/features/projects/components/events-list";

import { useQuery } from "@tanstack/react-query";
import { getSelectEvents } from "@/features/events/api/get-events";
import { SelectEventsComponentProps } from "@/features/projects/components/events-list";

export const Projects = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["selectEvents"],
    queryFn: getSelectEvents,
  });

  const events: SelectEventsComponentProps["data"] = data?.data || [];

  return (
    <ContentLayout title="Projects">
      <div>
        <SelectEventsComponent
          data={events}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </ContentLayout>
  );
};
