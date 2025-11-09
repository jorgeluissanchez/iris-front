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
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  
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

  // Initialize selected event when course data is loaded
  useEffect(() => {
    if (course?.eventId && isOpen) {
      setSelectedEvent(course.eventId);
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
                
                const data = {
                  ...rawData,
                  eventId: selectedEvent,
                  active: rawData.active === "true",
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
                  placeholder="Select an event"
                  selectedKeys={selectedEvent ? [selectedEvent] : []}
                  onSelectionChange={(keys) => {
                    const keysArray = Array.from(keys);
                    setSelectedEvent(keysArray[0] as string || "");
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
                  name="active"
                  defaultSelectedKeys={[course?.active ? "true" : "false"]}
                >
                  <SelectItem key="true">
                    Active
                  </SelectItem>
                  <SelectItem key="false">
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
