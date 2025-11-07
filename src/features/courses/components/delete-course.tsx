"use client";

import { Trash } from "lucide-react";
import { useSearchParams } from "next/navigation";

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

import { useDeleteCourse } from "../api/delete-course";
import { useDisclosure } from "@heroui/use-disclosure";

type DeleteCourseProps = {
  id: string;
};

export const DeleteCourse = ({ id }: DeleteCourseProps) => {
  const searchParams = useSearchParams();
  const currentEventId = searchParams?.get("event") || undefined;
  const user = useUser();
  const { addNotification } = useNotifications();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const deleteCourseMutation = useDeleteCourse({
    filterEventId: currentEventId,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: "success",
          title: "Course Deleted",
        });
        onClose();
      },
    },
  });

  // Only admins can delete courses
  if (user?.data?.role !== "ADMIN") {
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
        Delete Course
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-lg font-bold">Delete Course</h2>
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this course? This action cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={deleteCourseMutation.isPending}
                  onPress={() => deleteCourseMutation.mutate({ courseId: id })}
                  startContent={<Trash className="size-4" />}
                >
                  Delete Course
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
