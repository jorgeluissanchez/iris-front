import { Meta, StoryObj } from '@storybook/react';

import { Textarea } from './textarea';

const meta: Meta<typeof Textarea> = {
  component: Textarea,
  title: 'UI/Form/Textarea',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  render: () => (
    <Textarea
      placeholder="Enter your message"
      className="max-w-xs"
    />
  ),
};

export const WithLabel: Story = {
  render: () => (
    <Textarea
      label="Message"
      placeholder="Enter your message"
      className="max-w-xs"
    />
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Textarea
      label="Message"
      placeholder="Enter your message"
      description="Enter a detailed message about your inquiry"
      className="max-w-xs"
    />
  ),
};

export const WithErrorMessage: Story = {
  render: () => (
    <Textarea
      label="Message"
      placeholder="Enter your message"
      isInvalid
      errorMessage="Message is required"
      className="max-w-xs"
    />
  ),
};

export const Required: Story = {
  render: () => (
    <Textarea
      label="Message"
      placeholder="Enter your message"
      isRequired
      className="max-w-xs"
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <Textarea
      label="Message"
      placeholder="Disabled textarea"
      defaultValue="This is a disabled textarea"
      isDisabled
      className="max-w-xs"
    />
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <Textarea
      label="Message"
      defaultValue="This is a read-only textarea"
      isReadOnly
      className="max-w-xs"
    />
  ),
};

export const WithClearButton: Story = {
  render: () => (
    <Textarea
      label="Message"
      placeholder="Enter your message"
      isClearable
      className="max-w-xs"
    />
  ),
};

export const Autosize: Story = {
  render: () => (
    <Textarea
      label="Message"
      placeholder="This textarea will grow automatically"
      minRows={2}
      maxRows={6}
      className="max-w-xs"
    />
  ),
};

export const WithoutAutosize: Story = {
  render: () => (
    <Textarea
      label="Message"
      placeholder="Fixed height textarea"
      disableAutosize
      className="max-w-xs"
    />
  ),
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <Textarea size="sm" label="Small" placeholder="Enter your message" />
      <Textarea size="md" label="Medium" placeholder="Enter your message" />
      <Textarea size="lg" label="Large" placeholder="Enter your message" />
    </div>
  ),
};

export const DifferentVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <Textarea variant="flat" label="Flat" placeholder="Enter your message" />
      <Textarea variant="bordered" label="Bordered" placeholder="Enter your message" />
      <Textarea variant="faded" label="Faded" placeholder="Enter your message" />
      <Textarea variant="underlined" label="Underlined" placeholder="Enter your message" />
    </div>
  ),
};
