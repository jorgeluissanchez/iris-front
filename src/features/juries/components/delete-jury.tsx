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
import { useDisclosure } from '@/hooks/use-disclosure';
import { useNotifications } from "@/components/ui/notifications";
import { useDeleteJury } from "../api/delete-jury";

type DeleteJuryProps = {
  id: string;
};

export const DeleteJury = ({ id }: DeleteJuryProps) => {
  const { addNotification } = useNotifications();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const deleteJuryMutation = useDeleteJury({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: "success",
          title: "Jurado eliminado",
        });
        onClose();
      },
    },
  });

  return (
    <>
      <Button
        size="sm"
        variant="light"
        color="danger"
        onPress={onOpen}
        isIconOnly
      >
        <Trash size={16} />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-lg font-bold">Eliminar Jurado</h2>
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-gray-500">
                  ¿Estás seguro de que deseas eliminar este jurado? Esta acción no se puede deshacer.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  isLoading={deleteJuryMutation.isPending}
                  onPress={() => deleteJuryMutation.mutate({ juryId: id })}
                  startContent={<Trash className="size-4" />}
                >
                  Eliminar Jurado
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

