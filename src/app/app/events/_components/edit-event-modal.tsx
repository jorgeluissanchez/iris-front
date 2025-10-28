import { useNotifications } from "@/components/ui/notifications/notifications-store";
import { useEvent } from "@/features/events/api/get-event";
import { updateEvent } from "@/features/events/api/update-event";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Switch,
  Input,
  Form,
  Textarea,
  DatePicker,
} from "@heroui/react";

import { SquarePen } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CalendarDate } from "node_modules/@heroui/system/dist/types";
import { parseDate } from "@internationalized/date";

export default function EditEventModal({ eventId }: { eventId: string }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  const res = useEvent({ eventId });

  const currentEventInfo = res.data?.data;

  const getCurrentEvaluationStatus = () => {
    if (currentEventInfo?.evaluationsStatus === "open") {
      return true;
    } else {
      return false;
    }
  };

  const [formData, setFormData] = useState({
    eventName: currentEventInfo?.title || "",
    description: currentEventInfo?.description || "",
    accessCode: currentEventInfo?.accessCode || "",
    startDate: currentEventInfo?.startDate || "",
    endDate: currentEventInfo?.endDate || "",
    inscriptionDeadline: currentEventInfo?.inscriptionDeadline || "",
    evaluationsOpened: getCurrentEvaluationStatus() || false,
  });

  const editEventMutation = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries();
      addNotification({
        type: "success",
        title: "Evento actualizado",
        message: "El evento se ha actualizado exitosamente",
      });
      handleClose();
    },
    onError: (error: any) => {
      addNotification({
        type: "error",
        title: "Error",
        message: error.message || "Error al actualizar el evento",
      });
    },
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      !formData.eventName ||
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
  };

  const handleClose = () => {
    setFormData({
      eventName: "",
      description: "",
      accessCode: "",
      startDate: "",
      endDate: "",
      inscriptionDeadline: "",
      evaluationsOpened: true,
    });
    onOpenChange();
  };

  const handleInputDateChange = (field: string, value: CalendarDate | null) => {
    if (value) {
      const formattedDate = `${value.year}-${value.month}-${value.day}`;
      handleInputChange(field, formattedDate);
    }
  };

  return (
    <>
      <Button size="sm" onPress={onOpen}>
        <SquarePen size={16} />
        Edit Event
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold">Edit event</h2>
              <p className="text-sm text-gray-500">
                Modify the details of the event
              </p>
            </ModalHeader>
            <ModalBody>
              <Form className="space-y-4">
                <Input
                  label="Event name*"
                  placeholder="Engineering Expo 2025"
                  value={formData.eventName}
                  onChange={(e) =>
                    handleInputChange("eventName", e.target.value)
                  }
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
                    value={parseDate(formData.startDate)}
                    onChange={(newDate) =>
                      handleInputDateChange("startDate", newDate)
                    }
                    isRequired
                  />
                  <DatePicker
                    label="End date*"
                    value={parseDate(formData.endDate)}
                    onChange={(newDate) =>
                      handleInputDateChange("endDate", newDate)
                    }
                    isRequired
                  />
                </div>

                <DatePicker
                  label="Inscription deadline*"
                  value={parseDate(formData.inscriptionDeadline)}
                  onChange={(newDate) =>
                    handleInputDateChange("inscriptionDeadline", newDate)
                  }
                  isRequired
                />

                <div className="flex items-center gap-2">
                  <Switch
                    isSelected={formData.evaluationsOpened}
                    onValueChange={(value) =>
                      handleInputChange("evaluationsOpened", value)
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
                isLoading={editEventMutation.isPending}
              >
                Save changes
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
