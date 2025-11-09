"use client";

import { SquarePen } from "lucide-react";

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

import { useCriterion } from "../api/get-criterion";
import {
  updateCriteriaInputSchema,
  useUpdateCriteria,
} from "../api/update-criteria";
import { Input } from "@/components/ui/input";

type UpdateCriteriaProps = {
  criterionId: string;
};

export const UpdateCriteria = ({ criterionId }: UpdateCriteriaProps) => {
  const { addNotification } = useNotifications();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  
  const criterionQuery = useCriterion({ criterionId });
  const updateCriteriaMutation = useUpdateCriteria({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: "success",
          title: "Criteria Updated",
          message: "The evaluation criteria has been updated successfully.",
        });
        onClose();
      },
      onError: (error: any) => {
        addNotification({
          type: "error",
          title: "Error",
          message: error?.message || "Failed to update criteria",
        });
      },
    },
  });

  const user = useUser();
  const criterion = criterionQuery.data?.data;

  // Only admins can update criteria
  if (user?.data?.role !== "ADMIN") {
    return null;
  }

  return (
    <>
      <Button
      className="w-full"
        variant="shadow"
        size="sm"
        onMouseEnter={() => criterionQuery.refetch()}
        onPress={() => onOpen()}
        startContent={<SquarePen size={16} />}
      >
        Edit
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <Form
              key={`update-criteria-${criterionId}-${isOpen}`}
              id="update-criteria"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);

                const rawData = Object.fromEntries(formData);
                
                const data: any = {};
                if (rawData.name) data.name = rawData.name;
                if (rawData.description) data.description = rawData.description;
                if (rawData.weight) data.weight = Number(rawData.weight);

                try {
                  const values = await updateCriteriaInputSchema.parseAsync(data);
                  await updateCriteriaMutation.mutateAsync({
                    data: values,
                    criterionId,
                  });
                } catch (error) {
                  // Validation errors are handled by the schema
                  console.error("Validation error:", error);
                }
              }}
            >
              <ModalHeader className="flex flex-col gap-1">
                Update Criteria
                <p className="text-sm font-normal text-gray-500">
                  Update the evaluation criteria
                </p>
              </ModalHeader>
              <ModalBody className="space-y-4 w-full">
                <Input
                  label="Name"
                  name="name"
                  defaultValue={criterion?.name ?? ""}
                  placeholder="e.g., Technical Quality"
                />
                
                <Textarea
                  label="Description"
                  name="description"
                  defaultValue={criterion?.description ?? ""}
                  placeholder="Brief description of the criteria"
                />

                <Input
                  type="number"
                  label="Weight"
                  name="weight"
                  defaultValue={criterion?.weight?.toString() ?? "0"}
                  min="0"
                  max="1"
                  step="0.01"
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
                  isLoading={updateCriteriaMutation.isPending}
                  disabled={updateCriteriaMutation.isPending}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

