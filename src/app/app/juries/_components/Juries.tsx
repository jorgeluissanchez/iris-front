"use client";

import { ContentLayout } from "@/components/layouts/content-layout";
import { JuriesList } from "@/features/juries/components/juries-list";
export const Juries = () => {
  return (
    <ContentLayout title="Juries">
      <JuriesList />
    </ContentLayout>
  );
};
