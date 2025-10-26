import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from './pagination';

const meta: Meta<typeof Pagination> = {
  component: Pagination,
  title: 'UI/Pagination',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    total: {
      control: { type: 'number' },
    },
    page: {
      control: { type: 'number' },
    },
    showControls: {
      control: { type: 'boolean' },
    },
    showShadow: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    total: 10,
    page: 1,
  },
};

export const WithControls: Story = {
  args: {
    total: 10,
    page: 1,
    showControls: true,
  },
};

export const WithShadow: Story = {
  args: {
    total: 15,
    page: 8,
    showControls: true,
    showShadow: true,
  },
};

export const Controlled: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const total = 20;
    
    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          Current page: {currentPage} of {total}
        </div>
        <Pagination
          total={total}
          page={currentPage}
          onChange={setCurrentPage}
          showControls
        />
      </div>
    );
  },
};

export const LargeDataset: Story = {
  args: {
    total: 50,
    page: 25,
    showControls: true,
    showShadow: true,
  },
};
