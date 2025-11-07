"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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
import { canInviteJury } from "@/lib/authorization";
import { createJuryInputSchema, useCreateJury } from "../api/create-jury";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { useEventsDropdown } from "@/features/events/api/get-events-dropdown";

export const InviteModal = () => {
  const { addNotification } = useNotifications();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedEventKeys, setSelectedEventKeys] = useState<Set<string>>(
    new Set()
  );
  const queryClient = useQueryClient();

  const eventsQuery = useEventsDropdown();
  const events = eventsQuery.data?.data || [];

  const createJuryMutation = useCreateJury({
    mutationConfig: {
      onSuccess: async () => {
        addNotification({ type: "success", title: "Jurado invitado" });
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["juries"] }),
          eventsQuery.refetch(),
        ]);
        onClose();
      },
    },
  });

  const user = useUser();
  if (!canInviteJury(user?.data)) return null;

  return (
    <>
      <Button size="md" onPress={onOpen} color="primary">
        <Plus size={16} />
        Invitar Jurado
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <Form
              id="invite-jurors"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                const rawData = Object.fromEntries(formData);
                const key = Array.from(selectedEventKeys)[0] ?? "";
                if (!key) return;
                const data = {
                  ...rawData,
                  eventId: key,
                };
                const values = await createJuryInputSchema.parseAsync(data);
                await createJuryMutation.mutateAsync({ data: values });
              }}
            >
              <ModalHeader className="flex flex-col gap-1">
                Invitar Jurado
              </ModalHeader>
              <ModalBody className="space-y-4 w-full">
                <Input label="Correo" name="email" isRequired />
                <Select
                  label="Evento"
                  placeholder="Selecciona un evento"
                  selectionMode="single"
                  isRequired
                  selectedKeys={selectedEventKeys}
                  onSelectionChange={(keys) =>
                    setSelectedEventKeys(keys as Set<string>)
                  }
                  isLoading={eventsQuery.isLoading}
                >
                  {events.map((event) => (
                    <SelectItem key={String(event.id)}>
                      {event.title}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button
                  type="submit"
                  isLoading={createJuryMutation.isPending}
                  disabled={createJuryMutation.isPending}
                >
                  Invitar Jurado
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
