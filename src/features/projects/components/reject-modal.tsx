"use client";

import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useNotifications } from "@/components/ui/notifications";
import { useState } from "react";
import { useRejectProject } from "../api/reject-project";

export const RejectProjectModal = ({ projectId }: { projectId: number }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { addNotification } = useNotifications();
  const rejectMutation = useRejectProject();

  const [reason, setReason] = useState("");

  return (
    <>
      <Button size="sm" color="danger" onPress={onOpen}>
        Rechazar
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
        <ModalContent>
          {(onCloseModal) => (
            <>
              <ModalHeader>Rechazar Proyecto</ModalHeader>
              <ModalBody className="space-y-2">
                <p>Ingresa el motivo del rechazo:</p>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Escribe el motivo del rechazo aquí..."
                  rows={4}
                />
              </ModalBody>
              <ModalFooter className="space-x-2">
                <Button variant="light" onPress={onCloseModal}>
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    if (!reason.trim()) {
                      addNotification({
                        type: "error",
                        title: "Error",
                        message: "Debes ingresar un motivo",
                      });
                      return;
                    }
                    rejectMutation.mutate(
                      { projectId, reason },
                      {
                        onSuccess: (res) => {
                          addNotification({
                            type: "success",
                            title: "Proyecto rechazado",
                            message: `Motivo: ${res.reason}`,
                          });
                          setReason("");
                          onCloseModal();
                        },
                        onError: () => {
                          addNotification({
                            type: "error",
                            title: "Error",
                            message: "No se pudo rechazar el proyecto",
                          });
                        },
                      }
                    );
                  }}
                >
                  Rechazar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
