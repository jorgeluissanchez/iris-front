import { Meta, StoryObj } from '@storybook/react';

import { Button } from '@/components/ui/button';

import { ConfirmationDialog } from './confirmation-dialog';

const meta: Meta<typeof ConfirmationDialog> = {
  component: ConfirmationDialog,
  title: 'UI/ConfirmationDialog',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: { type: 'select' },
      options: ['danger', 'info'],
    },
    title: {
      control: { type: 'text' },
    },
    body: {
      control: { type: 'text' },
    },
    cancelButtonText: {
      control: { type: 'text' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ConfirmationDialog>;

export const Danger: Story = {
  args: {
    icon: 'danger',
    title: 'Delete Item',
    body: 'Are you sure you want to delete this item? This action cannot be undone.',
    confirmButton: <Button color="danger">Delete</Button>,
    triggerButton: (
      <Button color="danger" variant="bordered">
        Delete Item
      </Button>
    ),
    cancelButtonText: 'Cancel',
  },
};

export const Info: Story = {
  args: {
    icon: 'info',
    title: 'Information',
    body: 'This action will update your profile information. Do you want to continue?',
    confirmButton: <Button color="primary">Continue</Button>,
    triggerButton: (
      <Button color="primary" variant="bordered">
        Update Profile
      </Button>
    ),
    cancelButtonText: 'Cancel',
  },
};

export const Warning: Story = {
  args: {
    icon: 'danger',
    title: 'Warning',
    body: 'You are about to perform an action that may have unintended consequences. Are you sure you want to proceed?',
    confirmButton: <Button color="warning">Proceed</Button>,
    triggerButton: (
      <Button color="warning" variant="bordered">
        Warning Action
      </Button>
    ),
    cancelButtonText: 'Go Back',
  },
};

export const Success: Story = {
  args: {
    icon: 'info',
    title: 'Confirm Action',
    body: 'This action will save your changes and publish them to the public. Continue?',
    confirmButton: <Button color="success">Publish</Button>,
    triggerButton: (
      <Button color="success" variant="bordered">
        Publish Changes
      </Button>
    ),
    cancelButtonText: 'Save Draft',
  },
};

export const CustomContent: Story = {
  args: {
    icon: 'danger',
    title: 'Delete Account',
    body: 'This will permanently delete your account and all associated data. This action cannot be undone.',
    confirmButton: (
      <Button color="danger" variant="solid">
        Yes, Delete Account
      </Button>
    ),
    triggerButton: (
      <Button color="danger" variant="light">
        Delete Account
      </Button>
    ),
    cancelButtonText: 'Keep Account',
  },
};

export const WithoutBody: Story = {
  args: {
    icon: 'info',
    title: 'Are you sure?',
    body: '',
    confirmButton: <Button color="primary">Yes</Button>,
    triggerButton: <Button variant="bordered">Confirm Action</Button>,
    cancelButtonText: 'No',
  },
};

export const LongContent: Story = {
  args: {
    icon: 'danger',
    title: 'Important Notice',
    body: 'This action will permanently remove all data associated with this project, including all files, settings, and configurations. This includes any backups or snapshots that may have been created. Please ensure you have exported any important data before proceeding, as this action cannot be undone and there is no way to recover the deleted information.',
    confirmButton: (
      <Button color="danger">I Understand, Delete Everything</Button>
    ),
    triggerButton: (
      <Button color="danger" variant="bordered">
        Delete Project
      </Button>
    ),
    cancelButtonText: 'Cancel',
  },
};
