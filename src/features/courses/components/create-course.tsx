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

import {
  createCourseInputSchema,
  useCreateCourse,
} from "../api/create-course";
import { Input } from "@/components/ui/input";

export const CreateCourse = () => {
  const { addNotification } = useNotifications();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState<string>("");

  const createCourseMutation = useCreateCourse({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: "success",
          title: "Course Created",
        });
        setSelectedEvent("");
        onClose();
      },
    },
  });

  const eventsQuery = useEventsDropdown();
  const user = useUser();

  // Only admins can create courses (similar to projects)
  if (user?.data?.role !== "ADMIN") {
    return null;
  }

  const events = eventsQuery.data?.data || [];

  return (
    <>
      <Button size="sm" onPress={() => onOpen()}>
        <Plus size={16} />
        Create course
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <Form
              id="create-course"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);

                const rawData = Object.fromEntries(formData);
                
                // Validar que se haya seleccionado un evento
                if (!selectedEvent) {
                  addNotification({
                    type: "error",
                    title: "Event Required",
                    message: "Please select an event",
                  });
                  return;
                }
                
                const data = {
                  code: rawData.code as string,
                  description: rawData.description as string,
                  eventId: selectedEvent,
                  status: "active" as const,
                };
                
                const values = await createCourseInputSchema.parseAsync(data);
                await createCourseMutation.mutateAsync({ data: values });
              }}
            >
              <ModalHeader className="flex flex-col gap-1">
                Create new course
                <p className="text-sm font-normal text-gray-500">
                  Add a new course to an event
                </p>
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
                  isRequired
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
                  placeholder="2354"
                  isRequired 
                />
                
                <Textarea 
                  label="Description" 
                  name="description" 
                  placeholder="Brief description of the course"
                  isRequired 
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
                  isLoading={createCourseMutation.isPending}
                  disabled={createCourseMutation.isPending || !selectedEvent}
                >
                  Create course
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
