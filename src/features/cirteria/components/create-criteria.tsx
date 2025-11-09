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

import {
  createCriteriaInputSchema,
  useCreateCriteria,
} from "../api/create-criteria";
import { Input } from "@/components/ui/input";

export const CreateCriteria = () => {
  const { addNotification } = useNotifications();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const user = useUser();

  const createCriteriaMutation = useCreateCriteria({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: "success",
          title: "Criteria Created",
          message: "The evaluation criteria has been created successfully.",
        });
        onClose();
      },
      onError: (error: any) => {
        addNotification({
          type: "error",
          title: "Error",
          message: error?.message || "Failed to create criteria",
        });
      },
    },
  });

  // Only admins can create criteria
  if (user?.data?.role !== "ADMIN") {
    return null;
  }

  return (
    <>
      <Button size="sm" onPress={() => onOpen()}>
        <Plus size={16} />
        Create Criteria
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <Form
              id="create-criteria"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);

                const rawData = Object.fromEntries(formData);
                
                const data = {
                  ...rawData,
                  weight: Number(rawData.weight),
                };

                try {
                  const values = await createCriteriaInputSchema.parseAsync(data);
                  await createCriteriaMutation.mutateAsync({ data: values });
                } catch (error) {
                  // Validation errors are handled by the schema
                  console.error("Validation error:", error);
                }
              }}
            >
              <ModalHeader className="flex flex-col gap-1">
                Create new criteria
                <p className="text-sm font-normal text-gray-500">
                  Add a new evaluation criteria
                </p>
              </ModalHeader>
              <ModalBody className="space-y-4 w-full">
                <Input 
                  label="Name" 
                  name="name" 
                  placeholder="e.g., Technical Quality"
                  isRequired 
                />
                
                <Textarea 
                  label="Description" 
                  name="description" 
                  placeholder="Brief description of the criteria"
                  isRequired 
                />

                <Input
                  type="number"
                  label="Weight"
                  name="weight"
                  placeholder="0.0"
                  min="0"
                  max="1"
                  step="0.01"
                  isRequired
                  description="Weight of this criteria in the evaluation (e.g., 0.25 for 25%)"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={createCriteriaMutation.isPending}
                  disabled={createCriteriaMutation.isPending}
                >
                  Create Criteria
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

