"use client";
import { ContentLayout } from "@/components/layouts/content-layout";
import { CoursesList } from "@/features/courses/components/courses-list";
import { EventsDropdown } from "@/features/projects/components/events-dropdown";
import { CreateCourse } from "@/features/courses/components/create-course";

export const Courses = () => {
  return (
    <ContentLayout title="Course Management">
      <p className="text-gray-600 mb-4">Manage courses within events</p>
      <div className="flex justify-between">
        <EventsDropdown />
        <CreateCourse />
      </div>
      <div className="mt-4">
        <CoursesList />
      </div>
    </ContentLayout>
  );
};
