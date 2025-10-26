'use client';

import { Pen } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from '@/components/ui/drawer';
import { useDisclosure } from '@heroui/use-disclosure';
import { useNotifications } from '@/components/ui/notifications';
import { useUser } from '@/lib/auth';
import { canUpdateDiscussion } from '@/lib/authorization';

import { useDiscussion } from '../api/get-discussion';
import {
  updateDiscussionInputSchema,
  useUpdateDiscussion,
} from '../api/update-discussion';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

type UpdateDiscussionProps = {
  discussionId: string;
};

export const UpdateDiscussion = ({ discussionId }: UpdateDiscussionProps) => {
  const { addNotification } = useNotifications();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isPublic, setIsPublic] = useState(false);
  const discussionQuery = useDiscussion({ discussionId });
  const updateDiscussionMutation = useUpdateDiscussion({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Discussion Updated',
        });
        onClose();
      },
    },
  });

  const user = useUser();

  if (!canUpdateDiscussion(user?.data)) {
    return null;
  }

  const discussion = discussionQuery.data?.data;

  return (
    <>
      <Button size="sm" onPress={() => onOpen()} startContent={<Pen className="size-4" />}>Update Discussion</Button>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <DrawerContent>
          {(onClose) => (
            <Form
              id="update-discussion"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                // Convert the switch value from "on"/"off" to true/false
                const processedData = {
                  ...data,
                  public: data.public === 'on'
                };
                const values = await updateDiscussionInputSchema.parseAsync(processedData);
                await updateDiscussionMutation.mutateAsync({
                  data: values,
                  discussionId,
                });
              }}
            >
              <DrawerHeader>Update Discussion</DrawerHeader>
              <DrawerBody>
                <Input
                  label="Title"
                  name="title"
                  defaultValue={discussion?.title ?? ''}
                />
                <Textarea
                  label="Body"
                  name="body"
                  defaultValue={discussion?.body ?? ''}
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    onValueChange={setIsPublic}
                    defaultSelected={discussion?.public ?? false}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2`}
                    id="public"
                  />
                  <Input
                    type="hidden"
                    name="public"
                    value={isPublic ? 'on' : 'off'}
                  />
                  <label htmlFor="public" className="text-sm font-medium">Public</label>
                </div>
              </DrawerBody>
              <DrawerFooter>
                <Button type="submit" isLoading={updateDiscussionMutation.isPending} disabled={updateDiscussionMutation.isPending}>Submit</Button>
              </DrawerFooter>
            </Form>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
