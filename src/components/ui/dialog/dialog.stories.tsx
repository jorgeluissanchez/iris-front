import { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { useDisclosure } from '@/hooks/use-disclosure';

import { Dialog } from './dialog';

const DemoDialog = () => {
  const { close, open, isOpen, toggle } = useDisclosure();

  return (
    <>
      <Button variant="bordered" onPress={open}>
        Open Dialog
      </Button>
      <Dialog
        isOpen={isOpen}
        onOpenChange={toggle}
        title="Edit Profile"
        description="Make changes to your profile here. Click save when you're done."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="bordered" onPress={close}>
              Cancel
            </Button>
            <Button onPress={close}>Save changes</Button>
          </div>
        }
      >
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Enter your name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Enter your email"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

const meta: Meta<typeof Dialog> = {
  component: Dialog,
  title: 'UI/Dialog',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: [
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
        '3xl',
        '4xl',
        '5xl',
        'full',
      ],
    },
    placement: {
      control: { type: 'select' },
      options: ['center', 'top', 'top-center', 'bottom', 'bottom-center'],
    },
    backdrop: {
      control: { type: 'select' },
      options: ['opaque', 'blur', 'transparent'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Dialog>;

const SizesDialog = () => {
  const { open, close, toggle, isOpen } = useDisclosure();

  return (
    <>
      <Button onPress={open}>Open Different Sizes</Button>
      <Dialog
        isOpen={isOpen}
        onOpenChange={toggle}
        title="Dialog Sizes"
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="bordered" onPress={close}>
              Close
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p>This dialog demonstrates different sizes available in HeroUI.</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold">Small (sm)</h4>
              <p className="text-sm text-gray-600">
                Compact dialog for simple content
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold">Medium (md)</h4>
              <p className="text-sm text-gray-600">Standard dialog size</p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold">Large (lg)</h4>
              <p className="text-sm text-gray-600">
                Spacious dialog for complex content
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold">Extra Large (xl)</h4>
              <p className="text-sm text-gray-600">
                Maximum dialog size for extensive content
              </p>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export const Default: Story = {
  render: () => <DemoDialog />,
};

export const Sizes: Story = {
  render: () => <SizesDialog />,
};

const CustomContentDialog = () => {
  const { close, open, isOpen, toggle } = useDisclosure();

  return (
    <>
      <Button color="secondary" onPress={open}>
        Open Custom Dialog
      </Button>
      <Dialog
        isOpen={isOpen}
        onOpenChange={toggle}
        title="Custom Content Dialog"
        description="This dialog shows how to add custom content and styling"
        size="md"
        footer={
          <div className="flex justify-between gap-2">
            <Button variant="light" onPress={close}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button variant="bordered" onPress={close}>
                Save Draft
              </Button>
              <Button color="primary" onPress={close}>
                Publish
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4">
            <div className="flex size-8 items-center justify-center rounded-full bg-blue-500">
              <span className="text-sm font-bold text-white">!</span>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">Important Notice</h4>
              <p className="text-sm text-blue-700">
                Please review all changes before saving.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Form Fields</h3>
            <div className="grid gap-3">
              <input
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Title"
              />
              <textarea
                className="h-20 w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Description"
              />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export const WithCustomContent: Story = {
  render: () => <CustomContentDialog />,
};
