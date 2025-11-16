"use client";

import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { useNotifications } from "@/components/ui/notifications";
import { useUser } from "@/lib/auth";
import { canDeleteEvent } from "@/lib/authorization";

import { useDeleteEvent } from "../api/delete-event";
import { useDisclosure } from '@/hooks/use-disclosure';

type DeleteEventProps = {
  id: number;
};

export const DeleteEvent = ({ id }: DeleteEventProps) => {
  const user = useUser();
  const { addNotification } = useNotifications();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const deleteEventMutation = useDeleteEvent({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: "success",
          title: "Event Deleted",
        });
        onClose();
      },
    },
  });

  if (!canDeleteEvent(user?.data)) {
    return null;
  }

  return (
    <>
      <Button
        variant="shadow"
        className="w-full"
        size="sm"
        color="danger"
        onPress={() => onOpen()}
      >
        <Trash size={16} />
        Delete Event
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-lg font-bold">Delete Event</h2>
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this event?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={deleteEventMutation.isPending}
                  onPress={() => deleteEventMutation.mutate({ eventId: id })}
                  startContent={<Trash className="size-4" />}
                >
                  Delete Event
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
