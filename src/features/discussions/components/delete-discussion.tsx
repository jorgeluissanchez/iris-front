'use client';

import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal';
import { useNotifications } from '@/components/ui/notifications';
import { useUser } from '@/lib/auth';
import { canDeleteDiscussion } from '@/lib/authorization';

import { useDeleteDiscussion } from '../api/delete-discussion';
import { useDisclosure } from '@heroui/use-disclosure';

type DeleteDiscussionProps = {
  id: string;
};

export const DeleteDiscussion = ({ id }: DeleteDiscussionProps) => {
  const user = useUser();
  const { addNotification } = useNotifications();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const deleteDiscussionMutation = useDeleteDiscussion({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Discussion Deleted',
        });
        onClose();
      },
    },
  });

  if (!canDeleteDiscussion(user?.data)) {
    return null;
  }

  return (
    <>
      <Button size="sm" onPress={() => onOpen()} startContent={<Trash className="size-4" />}>
        Delete Discussion
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-lg font-bold">Delete Discussion</h2>
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this discussion?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={deleteDiscussionMutation.isPending}
                  onPress={() => deleteDiscussionMutation.mutate({ discussionId: id })}
                >
                  <Trash className="size-4" />
                  Delete Discussion
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
