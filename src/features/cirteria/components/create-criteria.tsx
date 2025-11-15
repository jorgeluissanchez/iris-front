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
import { useEvents } from "@/features/events/api/get-events";
import { useCourses } from "@/features/courses/api/get-courses";

import {
  createCriteriaInputSchema,
  useCreateCriteria,
} from "../api/create-criteria";
import { Input } from "@/components/ui/input";

export const CreateCriteria = () => {
  const { addNotification } = useNotifications();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState<number | undefined>(undefined);
  const [selectedCourses, setSelectedCourses] = useState<Set<number>>(new Set());
  const user = useUser();

  const createCriteriaMutation = useCreateCriteria({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: "success",
          title: "Criteria Created",
          message: "The evaluation criteria has been created successfully.",
        });
        setSelectedEvent(undefined);
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

  const eventsQuery = useEvents({ page: 1 });
  const events = eventsQuery.data?.data ?? [];
  const coursesQuery = useCourses({ eventId: selectedEvent, queryConfig: { enabled: !!selectedEvent } });
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
                  courseIds: Array.from(selectedCourses),
                };

                console.log("📋 Selected Event:", selectedEvent);
                console.log("📋 Selected Courses:", Array.from(selectedCourses));
                console.log("📋 Data to send:", data);

                if (selectedCourses.size === 0) {
                  addNotification({
                    type: "error",
                    title: "Validation Error",
                    message: "Please select at least one course",
                  });
                  return;
                }

                try {
                  const values = await createCriteriaInputSchema.parseAsync(data);
                  console.log("✅ Validated data:", values);
                  await createCriteriaMutation.mutateAsync({ data: values });
                } catch (error) {
                  // Validation errors are handled by the schema
                  console.error("❌ Validation error:", error);
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
                  selectedKeys={selectedEvent ? [String(selectedEvent)] : []}
                  onSelectionChange={(keys) => {
                    const id = Array.from(keys)[0] as string;
                    setSelectedEvent(id ? Number(id) : undefined);
                    setSelectedCourses(new Set());
                  }}
                  isRequired
                  isLoading={eventsQuery.isLoading}
                >
                  {events.map((event) => (
                    <SelectItem key={event.id}>{event.name}</SelectItem>
                  ))}
                </Select>

                <Select
                  label="Courses"
                  placeholder={selectedEvent ? "Select one or more courses" : "Select an event first"}
                  selectionMode="multiple"
                  selectedKeys={selectedCourses.size > 0 ? Array.from(selectedCourses).map(String) : []}
                  onSelectionChange={(keys) => {
                    const numberSet = new Set(
                      Array.from(keys).map((key) => Number(key))
                    );
                    setSelectedCourses(numberSet);
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
                  variant="flat"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  isLoading={createCriteriaMutation.isPending}
                  disabled={createCriteriaMutation.isPending || !selectedEvent || selectedCourses.size === 0}
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

