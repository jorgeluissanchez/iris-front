import { Meta, StoryObj } from '@storybook/react';
import { parseDate, parseZonedDateTime } from '@internationalized/date';

import { DatePicker } from './date-picker';

const meta: Meta<typeof DatePicker> = {
  component: DatePicker,
  title: 'UI/DatePicker',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {
    label: 'Select a date',
  },
};

export const WithDefaultValue: Story = {
  args: {
    label: 'Event Date',
    defaultValue: parseDate('2025-11-15'),
  },
};

export const Disabled: Story = {
  args: {
    label: 'Event Date',
    isDisabled: true,
    defaultValue: parseDate('2025-11-15'),
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Event Date',
    isReadOnly: true,
    defaultValue: parseDate('2025-11-15'),
  },
};

export const Required: Story = {
  args: {
    label: 'Event Date',
    isRequired: true,
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Event Date',
    description: 'Please select the date for the event',
  },
};

export const WithErrorMessage: Story = {
  args: {
    label: 'Event Date',
    isInvalid: true,
    errorMessage: 'Please select a valid date',
  },
};

export const WithTimeFields: Story = {
  args: {
    label: 'Event Date & Time',
    granularity: 'minute',
    defaultValue: parseZonedDateTime('2025-11-15T10:00:00[America/New_York]'),
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <DatePicker label="Flat" variant="flat" />
      <DatePicker label="Bordered" variant="bordered" />
      <DatePicker label="Faded" variant="faded" />
      <DatePicker label="Underlined" variant="underlined" />
    </div>
  ),
};

export const LabelPlacements: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <DatePicker label="Inside" labelPlacement="inside" />
      <DatePicker label="Outside" labelPlacement="outside" />
      <DatePicker label="Outside Left" labelPlacement="outside-left" />
    </div>
  ),
};

export const WithMonthAndYearPickers: Story = {
  args: {
    label: 'Birth Date',
    showMonthAndYearPickers: true,
  },
};

