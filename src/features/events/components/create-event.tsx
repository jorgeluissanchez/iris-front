"use client";
import { Plus } from "lucide-react";
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
import { useDisclosure } from '@/hooks/use-disclosure';
import { useNotifications } from "@/components/ui/notifications";
import { useUser } from "@/lib/auth";
import { canCreateEvent } from "@/lib/authorization";

import { createEventInputSchema, useCreateEvent } from "../api/create-events";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";

export const CreateEvent = () => {
  const { addNotification } = useNotifications();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const createEventMutation = useCreateEvent({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: "success",
          title: "Event Created",
        });
        onClose();
      },
    },
  });

  const user = useUser();

  if (!canCreateEvent(user?.data)) {
    return null;
  }

  return (
    <>
      <Button size="sm" onPress={() => onOpen()}>
        <Plus size={16} />
        Create Event
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <Form
              id="create-event"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);

                const rawData = Object.fromEntries(formData);
                const data = {
                  ...rawData,
                  evaluationsStatus:
                    rawData.evaluationsStatus === "" ? "open" : "closed",
                  isPublic: rawData.isPublic === "",
                };

                const values = await createEventInputSchema.parseAsync(data);
                await createEventMutation.mutateAsync({ data: values });
              }}
            >
              <ModalHeader className="flex flex-col gap-1">
                Create Event
              </ModalHeader>
              <ModalBody className="space-y-4 w-full">
                <Input 
                  label="Title" 
                  name="title" 
                  placeholder="Enter event title"
                />
                <Textarea 
                  label="Description" 
                  name="description" 
                  placeholder="Enter event description"
                />
                <DatePicker label="Start Date" name="startDate" isRequired />
                <DatePicker label="End Date" name="endDate" isRequired />
                <DatePicker
                  label="Inscription Deadline"
                  name="inscriptionDeadline"
                  isRequired
                />
                <div className="flex flex-row gap-50">
                  <Switch
                    name="evaluationsStatus"
                    defaultSelected={false}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2`}
                  >
                    Evaluations Open
                  </Switch>
                  <Switch
                    name="isPublic"
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2`}
                  >
                    Public
                  </Switch>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  type="submit"
                  color="primary"
                  isLoading={createEventMutation.isPending}
                  disabled={createEventMutation.isPending}
                >
                  Create Event
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
