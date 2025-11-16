'use client';

import { Pen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from '@/components/ui/drawer';
import { useNotifications } from '@/components/ui/notifications';
import { useUser } from '@/lib/auth';
import { useDisclosure } from '@/hooks/use-disclosure';

import {
  updateProfileInputSchema,
  useUpdateProfile,
} from '../api/update-profile';


export const UpdateProfile = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const user = useUser();
  const { addNotification } = useNotifications();
  const updateProfileMutation = useUpdateProfile({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Profile Updated',
        });
        onClose();
      },
    },
  });

  return (
    <>
      <Button size="sm" onPress={() => onOpen()} startContent={<Pen className="size-4" />}>
        Update Profile
      </Button>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <DrawerContent>
          {(onClose) => (
            <Form
              id="update-profile"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                const values = await updateProfileInputSchema.parseAsync(data);
                await updateProfileMutation.mutateAsync({ data: values });
              }}
            >
              <DrawerHeader className="flex flex-col gap-1">Update Profile</DrawerHeader>
              <DrawerBody className="w-full">
                <Input
                  name="firstName"
                  label="First Name"
                  defaultValue={user.data?.firstName ?? ''}
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  defaultValue={user.data?.lastName ?? ''}
                />
                <Input
                  name="email"
                  label="Email Address"
                  type="email"
                  defaultValue={user.data?.email ?? ''}
                />

                <Textarea
                  name="bio"
                  label="Bio"
                  defaultValue={user.data?.bio ?? ''}
                />
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit" isLoading={updateProfileMutation.isPending} disabled={updateProfileMutation.isPending}>
                  Submit
                </Button>
              </DrawerFooter>
            </Form>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};