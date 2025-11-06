"use client";

import { SquarePen } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { useDisclosure } from "@heroui/use-disclosure";
import { useNotifications } from "@/components/ui/notifications";
import { useUser } from "@/lib/auth";
import { Select, SelectItem } from "@/components/ui/select";
import { useEventsDropdown } from "@/features/events/api/get-events-dropdown";

import { useCourse } from "../api/get-course";
import {
  updateCourseInputSchema,
  useUpdateCourse,
} from "../api/update-course";
import { Input } from "@/components/ui/input";

type UpdateCourseProps = {
  courseId: string;
};

export const UpdateCourse = ({ courseId }: UpdateCourseProps) => {
  const { addNotification } = useNotifications();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  
  const courseQuery = useCourse({ courseId });
  const updateCourseMutation = useUpdateCourse({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: "success",
          title: "Course Updated",
        });
        onClose();
      },
    },
  });

  const eventsQuery = useEventsDropdown();
  const user = useUser();

  const course = courseQuery.data?.data;
  const events = eventsQuery.data?.data || [];

  // Initialize selected events when course data is loaded
  useEffect(() => {
    if (course?.events && isOpen) {
      const eventIds = course.events.map((e) => e.id);
      setSelectedEvents(new Set(eventIds));
    }
  }, [course, isOpen]);

  // Only admins can update courses
  if (user?.data?.role !== "ADMIN") {
    return null;
  }

  return (
    <>
      <Button
        variant="shadow"
        className="w-full"
        size="sm"
        onMouseEnter={() => courseQuery.refetch()}
        onPress={() => onOpen()}
        startContent={<SquarePen size={16} />}
      >
        Edit course
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <Form
              key={`update-course-${courseId}-${isOpen}`}
              id="update-course"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);

                const rawData = Object.fromEntries(formData);
                
                // Convert selected events to array
                const eventIds = Array.from(selectedEvents);
                
                const data = {
                  ...rawData,
                  eventIds,
                };

                const values = await updateCourseInputSchema.parseAsync(data);
                await updateCourseMutation.mutateAsync({
                  data: values,
                  courseId,
                });
              }}
            >
              <ModalHeader className="flex flex-col gap-1">
                Update Course
              </ModalHeader>
              <ModalBody className="space-y-4 w-full">
                <Select
                  label="Event"
                  placeholder="Select events"
                  selectionMode="multiple"
                  selectedKeys={selectedEvents}
                  onSelectionChange={(keys) => {
                    setSelectedEvents(keys as Set<string>);
                  }}
                  isLoading={eventsQuery.isLoading}
                >
                  {events.map((event) => (
                    <SelectItem key={event.id}>
                      {event.title}
                    </SelectItem>
                  ))}
                </Select>
                
                <Input
                  label="Course code"
                  name="code"
                  defaultValue={course?.code ?? ""}
                  isRequired
                />
                
                <Textarea
                  label="Description"
                  name="description"
                  defaultValue={course?.description ?? ""}
                  isRequired
                />

                <Select
                  label="Status"
                  name="status"
                  defaultSelectedKeys={[course?.status ?? "active"]}
                >
                  <SelectItem key="active">
                    Active
                  </SelectItem>
                  <SelectItem key="inactive">
                    Inactive
                  </SelectItem>
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={updateCourseMutation.isPending}
                  disabled={updateCourseMutation.isPending}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
