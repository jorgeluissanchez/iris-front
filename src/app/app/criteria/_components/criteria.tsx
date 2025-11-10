"use client";

import { ContentLayout } from "@/components/layouts/content-layout";
import { CriteriaList } from "@/features/cirteria/components/criteria-list";
import { CreateCriteria } from "@/features/cirteria/components/create-criteria";
import '@/features/landing/index.css';

export const Criteria = () => {
  return (
    <ContentLayout title="Evaluation Criteria">
      <p className="text-gray-300 mb-4 text-sm sm:text-base">Manage evaluation criteria and their weights</p>
      <div className="flex justify-end gap-2 mb-4">
        <CreateCriteria />
      </div>
      <div className="mt-4">
        <CriteriaList />
      </div>
    </ContentLayout>
  );
};

