'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from '@/components/ui/drawer';
import { useDisclosure } from '@heroui/use-disclosure';
import { useNotifications } from '@/components/ui/notifications';

import {
  useCreateComment,
  createCommentInputSchema,
} from '../api/create-comment';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

type CreateCommentProps = {
  discussionId: string;
};

export const CreateComment = ({ discussionId }: CreateCommentProps) => {
  const { addNotification } = useNotifications();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const createCommentMutation = useCreateComment({
    discussionId,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Comment Created',
        });
        onClose();
      },
    },
  });

  return (
    <>
      <Button size="sm" onPress={() => onOpen()} startContent={<Plus className="size-4" />}>Create Comment</Button>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <DrawerContent>
          {(onClose) => (
            <Form
              id="create-comment"
              onSubmit={async (data) => {
                const values = await createCommentInputSchema.parseAsync(data);
                await createCommentMutation.mutateAsync({ data: values });
              }}
            >
              <DrawerHeader>Create Comment</DrawerHeader>
              <DrawerBody className="w-full">
                <Textarea
                  label="Body"
                />
                <Input type="hidden" value={discussionId} />
              </DrawerBody>
              <DrawerFooter>
                <Button type="submit" isLoading={createCommentMutation.isPending} disabled={createCommentMutation.isPending}>Submit</Button>
              </DrawerFooter>
            </Form>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};