import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './spinner';

const meta: Meta<typeof Spinner> = {
  title: 'UI/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Spinner size="sm" color="default" />
        <span>Default</span>
      </div>
      <div className="flex items-center gap-4">
        <Spinner size="sm" color="primary" />
        <span>Primary</span>
      </div>
      <div className="flex items-center gap-4">
        <Spinner size="sm" color="secondary" />
        <span>Secondary</span>
      </div>
      <div className="flex items-center gap-4">
        <Spinner size="sm" color="success" />
        <span>Success</span>
      </div>
      <div className="flex items-center gap-4">
        <Spinner size="sm" color="warning" />
        <span>Warning</span>
      </div>
      <div className="flex items-center gap-4">
        <Spinner size="sm" color="danger" />
        <span>Danger</span>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="sm" />
        <span className="text-sm text-gray-600">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="md" />
        <span className="text-sm text-gray-600">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" />
        <span className="text-sm text-gray-600">Large</span>
      </div>
    </div>
  ),
};

export const WithCustomClass: Story = {
  args: {
    className: 'border-4 border-blue-500',
    size: 'lg',
  },
};

export const InContainer: Story = {
  render: () => (
    <div className="flex h-48 w-full items-center justify-center border border-gray-200 rounded-lg">
      <Spinner size="lg" />
    </div>
  ),
};

export const LoadingState: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4 p-8">
      <Spinner size="md" color="primary" />
      <p className="text-gray-600">Loading...</p>
    </div>
  ),
};
