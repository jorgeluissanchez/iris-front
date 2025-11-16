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
import { canDeleteProject } from "@/lib/authorization";

import { useDeleteProject } from "../api/delete-project";
import { useDisclosure } from '@/hooks/use-disclosure';

type DeleteProjectProps = {
  id: string;
};

export const DeleteProject = ({ id }: DeleteProjectProps) => {
  const user = useUser();
  const { addNotification } = useNotifications();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const deleteProjectMutation = useDeleteProject({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: "success",
          title: "Project Deleted",
        });
        onClose();
      },
    },
  });

  if (!canDeleteProject(user?.data)) {
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
        Delete Project
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-lg font-bold">Delete Project</h2>
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this project?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={deleteProjectMutation.isPending}
                  onPress={() => deleteProjectMutation.mutate({ projectId: id })}
                  startContent={<Trash className="size-4" />}
                >
                  Delete Project
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
