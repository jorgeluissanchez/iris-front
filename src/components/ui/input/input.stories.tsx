import { Meta, StoryObj } from '@storybook/react';

import { Input } from './input';

const meta: Meta<typeof Input> = {
  component: Input,
  title: 'UI/Form/Input',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: () => <Input placeholder="Enter your name" />,
};

export const WithLabel: Story = {
  render: () => <Input label="Name" placeholder="Enter your name" />,
};

export const WithDescription: Story = {
  render: () => (
    <Input
      label="Email"
      placeholder="Enter your email"
      description="We'll never share your email with anyone."
    />
  ),
};

export const WithErrorMessage: Story = {
  render: () => (
    <Input
      label="Email"
      placeholder="Enter your email"
      isInvalid
      errorMessage="Please enter a valid email"
    />
  ),
};

export const Required: Story = {
  render: () => (
    <Input label="Name" placeholder="Enter your name" isRequired />
  ),
};

export const Disabled: Story = {
  render: () => (
    <Input
      label="Email"
      placeholder="Disabled input"
      defaultValue="example@email.com"
      isDisabled
    />
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <Input
      label="Email"
      defaultValue="example@email.com"
      isReadOnly
    />
  ),
};

export const WithClearButton: Story = {
  render: () => (
    <Input label="Name" placeholder="Enter your name" isClearable />
  ),
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <Input size="sm" label="Small" placeholder="Enter your name" />
      <Input size="md" label="Medium" placeholder="Enter your name" />
      <Input size="lg" label="Large" placeholder="Enter your name" />
    </div>
  ),
};

export const DifferentVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <Input variant="flat" label="Flat" placeholder="Enter your name" />
      <Input variant="bordered" label="Bordered" placeholder="Enter your name" />
      <Input variant="faded" label="Faded" placeholder="Enter your name" />
      <Input variant="underlined" label="Underlined" placeholder="Enter your name" />
    </div>
  ),
};

export const WithStartEndContent: Story = {
  render: () => (
    <Input
      label="Website"
      placeholder="username"
      startContent={
        <div className="pointer-events-none flex items-center">
          <span className="text-default-400 text-small">https://</span>
        </div>
      }
      endContent={
        <div className="pointer-events-none flex items-center">
          <span className="text-default-400 text-small">.com</span>
        </div>
      }
    />
  ),
};
