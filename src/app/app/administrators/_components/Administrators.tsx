"use client";

import { ContentLayout } from "@/components/layouts/content-layout";
import { AdministratorsList } from "@/features/administrators/components/administrators-list";
export const Administrators = () => {
  return (
    <ContentLayout title="Administrators">
      <AdministratorsList />
    </ContentLayout>
  );
};

