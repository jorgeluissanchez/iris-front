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
import { canCreateProject } from "@/lib/authorization";

import {
  createProjectInputSchema,
  useCreateProject,
} from "../api/create-project";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export const CreateProject = () => {
  const { addNotification } = useNotifications();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isPublic, setIsPublic] = useState(true);

  const createProjectMutation = useCreateProject({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: "success",
          title: "Project Created",
        });
        onClose();
      },
    },
  });

  const user = useUser();

  if (!canCreateProject(user?.data)) {
    return null;
  }

  return (
    <>
      <Button size="sm" onPress={() => onOpen()}>
        <Plus size={16} />
        Create Project
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <Form
              id="create-project"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);

                const rawData = Object.fromEntries(formData);
                const data = {
                  ...rawData,
                  isPublic: rawData.isPublic === "",
                };

                const values = await createProjectInputSchema.parseAsync(data);
                await createProjectMutation.mutateAsync({ data: values });
              }}
            >
              <ModalHeader className="flex flex-col gap-1">
                Create Project
              </ModalHeader>
              <ModalBody className="space-y-4 w-full">
                <Input label="Title" name="title" isRequired />
                <Textarea label="Description" name="description" isRequired />
                <Input label="Event ID" name="eventId" isRequired />
                <Input label="Team ID" name="teamId" />
                <Switch
                  name="isPublic"
                  defaultSelected={isPublic}
                  onValueChange={setIsPublic}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2`}
                >
                  Public
                </Switch>
              </ModalBody>
              <ModalFooter>
                <Button
                  type="submit"
                  isLoading={createProjectMutation.isPending}
                  disabled={createProjectMutation.isPending}
                >
                  Create Project
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
