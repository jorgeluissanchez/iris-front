"use client";

import { parseDate } from "@internationalized/date";
import { useEffect } from "react";
import { SquarePen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
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
import { canUpdateEvent } from "@/lib/authorization";

import { useEvent } from "../api/get-event";
import { updateEventInputSchema, useUpdateEvent } from "../api/update-event";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/utils/cn";

type UpdateEventProps = {
  eventId: number;
};

export const UpdateEvent = ({ eventId }: UpdateEventProps) => {
  const { addNotification } = useNotifications();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();  
  const eventQuery = useEvent({ eventId });
  const updateEventMutation = useUpdateEvent({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: "success",
          title: "Event Updated",
        });
        onClose();
      },
    },
  });

  const user = useUser();

  if (!canUpdateEvent(user?.data)) {
    return null;
  }

  const event = eventQuery.data?.data;


  return (
    <>
      <Button
        variant="shadow"
        className="w-full"
        size="sm"
        onPress={() => {
          eventQuery.refetch();
          onOpen();
        }}
      >
        <SquarePen size={16} />
        Update Event
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => {
            if (eventQuery.isLoading) {
              return (
                <>
                  <ModalHeader>Update Event</ModalHeader>
                  <ModalBody className="flex items-center justify-center py-12">
                    <Spinner size="lg" />
                  </ModalBody>
                </>
              );
            }

            if (!event) {
              return (
                <>
                  <ModalHeader>Update Event</ModalHeader>
                  <ModalBody>
                    <p>Event not found</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button onPress={onClose}>Close</Button>
                  </ModalFooter>
                </>
              );
            }

            return (
            <Form
              key={`update-event-${eventId}-${event?.updatedAt}`}
              id="update-event"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);

                const rawData = Object.fromEntries(formData);
                const data = {
                  id: Number(eventId),
                  name: rawData.name as string,
                  description: rawData.description as string,
                  accessCode: rawData.accessCode as string,
                  isPubliclyJoinable: rawData.isPubliclyJoinable === "true",
                  startDate: rawData.startDate as string,
                  endDate: rawData.endDate as string,
                  inscriptionDeadline: rawData.inscriptionDeadline as string,
                  evaluationsOpened: rawData.evaluationsOpened === "true",
                  active: rawData.active === "true",
                  location: rawData.location as string,
                };

                const values = await updateEventInputSchema.parseAsync(data);
                await updateEventMutation.mutateAsync({
                  data: values,
                });
              }}
            >
              <ModalHeader className="flex flex-col gap-1">
                Update Event
              </ModalHeader>
              <ModalBody className="space-y-4 w-full">
                <Input
                  label="Name"
                  name="name"
                  defaultValue={event?.name ?? ""}
                />
                <Textarea
                  label="Description"
                  name="description"
                  defaultValue={event?.description ?? ""}
                />
                <Input
                  label="Location"
                  name="location"
                  defaultValue={event?.location ?? ""}
                />
                <Input
                  label="Access Code"
                  name="accessCode"
                  defaultValue={event?.accessCode ?? ""}
                />
                <DatePicker
                  label="Start Date"
                  name="startDate"
                  defaultValue={
                    event?.startDate ? parseDate(event.startDate.split('T')[0]) : undefined
                  }
                  isRequired
                />
                <DatePicker
                  label="End Date"
                  name="endDate"
                  defaultValue={
                    event?.endDate ? parseDate(event.endDate.split('T')[0]) : undefined
                  }
                  isRequired
                />
                <DatePicker
                  label="Inscription Deadline"
                  name="inscriptionDeadline"
                  defaultValue={
                    event?.inscriptionDeadline
                      ? parseDate(event.inscriptionDeadline.split('T')[0])
                      : undefined
                  }
                  isRequired
                />

                <Switch
                  name="evaluationsOpened"
                  value="true"
                  defaultSelected={event?.evaluationsOpened}
                  classNames={{
                    base: cn(
                      "inline-flex flex-row-reverse w-full max-w-md bg-gray-200 hover:bg-gray-300 items-center",
                      "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                      "data-[selected=true]:border-gray-400"
                    ),
                    wrapper: "p-0 h-4 overflow-visible",
                    thumb: cn(
                      "w-6 h-6 border-2 shadow-lg",
                      "group-data-[hover=true]:border-gray-400",
                      //selected
                      "group-data-[selected=true]:ms-6",
                      // pressed
                      "group-data-[pressed=true]:w-7",
                      "group-data-pressed:group-data-selected:ms-4"
                    ),
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-medium">Evaluations Open</p>
                    <p className="text-tiny text-default-400">
                      Allow students to submit evaluations for the event.
                    </p>
                  </div>
                </Switch>

                <Switch
                  name="isPubliclyJoinable"
                  value="true"
                  defaultSelected={event?.isPubliclyJoinable}
                  classNames={{
                    base: cn(
                      "inline-flex flex-row-reverse w-full max-w-md bg-gray-200 hover:bg-gray-300 items-center",
                      "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                      "data-[selected=true]:border-gray-400"
                    ),
                    wrapper: "p-0 h-4 overflow-visible",
                    thumb: cn(
                      "w-6 h-6 border-2 shadow-lg",
                      "group-data-[hover=true]:border-gray-400",
                      "group-data-[selected=true]:ms-6",
                      "group-data-[pressed=true]:w-7",
                      "group-data-pressed:group-data-selected:ms-4"
                    ),
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-medium">Publicly Joinable</p>
                    <p className="text-tiny text-default-400">
                      Allow anyone to join this event.
                    </p>
                  </div>
                </Switch>

                <Switch
                  name="active"
                  value="true"
                  defaultSelected={event?.active}
                  classNames={{
                    base: cn(
                      "inline-flex flex-row-reverse w-full max-w-md bg-gray-200 hover:bg-gray-300 items-center",
                      "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                      "data-[selected=true]:border-gray-400"
                    ),
                    wrapper: "p-0 h-4 overflow-visible",
                    thumb: cn(
                      "w-6 h-6 border-2 shadow-lg",
                      "group-data-[hover=true]:border-gray-400",
                      "group-data-[selected=true]:ms-6",
                      "group-data-[pressed=true]:w-7",
                      "group-data-pressed:group-data-selected:ms-4"
                    ),
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-medium">Active</p>
                    <p className="text-tiny text-default-400">
                      Activate or deactivate this event.
                    </p>
                  </div>
                </Switch>
              </ModalBody>
              <ModalFooter>
                <Button
                  type="submit"
                  isLoading={updateEventMutation.isPending}
                  disabled={updateEventMutation.isPending}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </Form>
            );
          }}
        </ModalContent>
      </Modal>
    </>
  );
};
