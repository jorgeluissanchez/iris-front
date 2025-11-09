"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

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
import { useCoursesDropdown } from "@/features/courses/api/get-courses-dropdown";

import {
  createCriteriaInputSchema,
  useCreateCriteria,
} from "../api/create-criteria";
import { Input } from "@/components/ui/input";

export const CreateCriteria = () => {
  const { addNotification } = useNotifications();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const user = useUser();

  const createCriteriaMutation = useCreateCriteria({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: "success",
          title: "Criteria Created",
          message: "The evaluation criteria has been created successfully.",
        });
        setSelectedEvent("");
        setSelectedCourses(new Set());
        onClose();
      },
      onError: (error: any) => {
        addNotification({
          type: "error",
          title: "Error",
          message: error?.message || "Failed to create criteria",
        });
      },
    },
  });

  // Only admins can create criteria
  if (user?.data?.role !== "ADMIN") {
    return null;
  }

  const eventsQuery = useEventsDropdown();
  const events = eventsQuery.data?.data ?? [];
  const coursesQuery = useCoursesDropdown({ eventId: selectedEvent, queryConfig: { enabled: !!selectedEvent } });
  const courses = coursesQuery.data?.data ?? [];

  return (
    <>
      <Button size="sm" onPress={() => onOpen()}>
        <Plus size={16} />
        Create Criteria
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <Form
              id="create-criteria"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);

                const rawData = Object.fromEntries(formData);
                
                const data = {
                  eventId: selectedEvent,
                  name: rawData.name as string,
                  description: rawData.description as string,
                  weight: Number(rawData.weight),
                  criterionCourse:
                    Array.from(selectedCourses).map((id) => ({ courseId: id })),
                };

                try {
                  const values = await createCriteriaInputSchema.parseAsync(data);
                  await createCriteriaMutation.mutateAsync({ data: values });
                } catch (error) {
                  // Validation errors are handled by the schema
                  console.error("Validation error:", error);
                }
              }}
            >
              <ModalHeader className="flex flex-col gap-1">
                Create new criteria
                <p className="text-sm font-normal text-gray-500">
                  Add a new evaluation criteria
                </p>
              </ModalHeader>
              <ModalBody className="space-y-4 w-full">
                <Select
                  label="Event"
                  placeholder="Select an event"
                  selectedKeys={selectedEvent ? [selectedEvent] : []}
                  onSelectionChange={(keys) => {
                    const id = Array.from(keys)[0] as string;
                    setSelectedEvent(id || "");
                    setSelectedCourses(new Set());
                  }}
                  isRequired
                  isLoading={eventsQuery.isLoading}
                >
                  {events.map((event) => (
                    <SelectItem key={event.id}>{event.title}</SelectItem>
                  ))}
                </Select>

                <Select
                  label="Courses"
                  placeholder={selectedEvent ? "Select one or more courses" : "Select an event first"}
                  selectionMode="multiple"
                  selectedKeys={selectedCourses}
                  onSelectionChange={(keys) => {
                    const set = keys instanceof Set ? keys : new Set(Array.from(keys));
                    setSelectedCourses(set as Set<string>);
                  }}
                  isDisabled={!selectedEvent}
                  isLoading={!!selectedEvent && coursesQuery.isLoading}
                >
                  {courses.length > 0 ? (
                    courses.map((course) => (
                      <SelectItem key={String(course.id)}>{course.code}</SelectItem>
                    ))
                  ) : (
                    <SelectItem key="no-courses" isDisabled>
                      {selectedEvent ? "No courses" : "Select an event first"}
                    </SelectItem>
                  )}
                </Select>
                <Input 
                  label="Name" 
                  name="name" 
                  placeholder="e.g., Technical Quality"
                  isRequired 
                />
                
                <Textarea 
                  label="Description" 
                  name="description" 
                  placeholder="Brief description of the criteria"
                  isRequired 
                />

                <Input
                  type="number"
                  label="Weight"
                  name="weight"
                  placeholder="0.0"
                  min="0"
                  max="1"
                  step="0.01"
                  isRequired
                  description="Weight of this criteria in the evaluation (e.g., 0.25 for 25%)"
                />
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
                  isLoading={createCriteriaMutation.isPending}
                  disabled={createCriteriaMutation.isPending || !selectedEvent}
                >
                  Create Criteria
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

