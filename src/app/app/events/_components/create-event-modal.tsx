import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  DatePicker,
} from "@heroui/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent } from "@/features/events/api/create-events";
import { useNotifications } from "@/components/ui/notifications";
import { CalendarDate } from "node_modules/@heroui/system/dist/types";
import { Event } from "@/types/api";

export default function CreateEventModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  const initialFormData: Event = {
    id: "",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    inscriptionDeadline: "",
    evaluationsStatus: "open",
    isPublic: true,
    accessCode: "",
    createdAt: 0,
  };

  const [formData, setFormData] = useState(initialFormData);

  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries();
      addNotification({
        type: "success",
        title: "Evento creado",
        message: "El evento se ha creado exitosamente",
      });
      handleClose();
    },
    onError: (error: any) => {
      addNotification({
        type: "error",
        title: "Error",
        message: error.message || "Error al crear el evento",
      });
    },
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInputDateChange = (field: string, value: CalendarDate | null) => {
    if (value) {
      const formattedDate = `${value.year}-${value.month}-${value.day}`;
      handleInputChange(field, formattedDate);
    }
  };

  const handleSubmit = () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.inscriptionDeadline
    ) {
      addNotification({
        type: "error",
        title: "Error",
        message: "Por favor completa todos los campos requeridos",
      });
      return;
    }

    createEventMutation.mutate({
      title: formData.title,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      inscriptionDeadline: formData.inscriptionDeadline,
      evaluationsStatus: formData.evaluationsStatus ? "open" : "closed",
      isPublic: true,
    });
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      accessCode: "",
      startDate: "",
      endDate: "",
      inscriptionDeadline: "",
      evaluationsStatus: "open",
      isPublic: true,
      id: "",
      createdAt: 0,
    });
    onOpenChange();
  };

  return (
    <>
      <Button onPress={onOpen}>Create Event</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold">Create new event</h2>
              <p className="text-sm text-gray-500">
                Add a new evaluation event to the platform
              </p>
            </ModalHeader>
            <ModalBody>
              <Form className="space-y-4">
                <Input
                  label="Event name*"
                  placeholder="Engineering Expo 2025"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  isRequired
                />

                <Textarea
                  label="Description*"
                  placeholder="Brief description of the event"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  isRequired
                />

                <Input
                  label="Access code*"
                  placeholder="EXPO2025"
                  value={formData.accessCode}
                  onChange={(e) =>
                    handleInputChange("accessCode", e.target.value)
                  }
                  isRequired
                />

                <div className="grid grid-cols-2 gap-4">
                  <DatePicker
                    label="Start date*"
                    onChange={(newDate) =>
                      handleInputDateChange("startDate", newDate)
                    }
                    isRequired
                  />
                  <DatePicker
                    label="End date*"
                    onChange={(newDate) =>
                      handleInputDateChange("endDate", newDate)
                    }
                    isRequired
                  />
                </div>

                <DatePicker
                  label="Inscription deadline*"
                  onChange={(newDate) =>
                    handleInputDateChange("inscriptionDeadline", newDate)
                  }
                  isRequired
                />

                <div className="flex items-center gap-2">
                  <Switch
                    isSelected={formData.evaluationsStatus === "open"}
                    onValueChange={(value) =>
                      handleInputChange(
                        "evaluationsStatus",
                        value ? "open" : "closed"
                      )
                    }
                  />
                  <span className="text-sm">Evaluations opened</span>
                </div>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={handleClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={createEventMutation.isPending}
              >
                Create event
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
