'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from '@/components/ui/drawer';
import { useDisclosure } from '@heroui/use-disclosure';
import { useNotifications } from '@/components/ui/notifications';
import { useUser } from '@/lib/auth';
import { canCreateDiscussion } from '@/lib/authorization';

import {
  createDiscussionInputSchema,
  useCreateDiscussion,
} from '../api/create-discussion';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export const CreateDiscussion = () => {
  const { addNotification } = useNotifications();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isPublic, setIsPublic] = useState(false);
  const createDiscussionMutation = useCreateDiscussion({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Discussion Created',
        });
        onClose();
      },
    },
  });

  const user = useUser();

  if (!canCreateDiscussion(user?.data)) {
    return null;
  }

  return (
    <>
      <Button size="sm" onPress={() => onOpen()} startContent={<Plus className="size-4" />}>Create Discussion</Button>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <DrawerContent>
          {(onClose) => (
            <Form
              id="create-discussion"
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
                const values = await createDiscussionInputSchema.parseAsync(processedData);
                await createDiscussionMutation.mutateAsync({ data: values });
              }}
            >
              <DrawerHeader>Create Discussion</DrawerHeader>
              <DrawerBody>
                <Input
                  label="Title"
                  name="title"
                />
                <Textarea
                  label="Body"
                  name="body"
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    onValueChange={setIsPublic}
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
                <Button type="submit" isLoading={createDiscussionMutation.isPending} disabled={createDiscussionMutation.isPending}>Submit</Button>
              </DrawerFooter>
            </Form>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
