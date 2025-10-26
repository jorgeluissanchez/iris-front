import { Meta, StoryObj } from '@storybook/react';

import { Select, SelectItem, SelectSection } from './select';

const meta: Meta<typeof Select> = {
  component: Select,
  title: 'UI/Form/Select',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <Select placeholder="Select an option" className="max-w-xs">
      <SelectItem key="option1">Option 1</SelectItem>
      <SelectItem key="option2">Option 2</SelectItem>
      <SelectItem key="option3">Option 3</SelectItem>
    </Select>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <Select label="Choose an option" placeholder="Select an option" className="max-w-xs">
      <SelectItem key="option1">Option 1</SelectItem>
      <SelectItem key="option2">Option 2</SelectItem>
      <SelectItem key="option3">Option 3</SelectItem>
    </Select>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Select
      label="Choose an option"
      placeholder="Select an option"
      description="This is a description"
      className="max-w-xs"
    >
      <SelectItem key="option1">Option 1</SelectItem>
      <SelectItem key="option2">Option 2</SelectItem>
      <SelectItem key="option3">Option 3</SelectItem>
    </Select>
  ),
};

export const WithErrorMessage: Story = {
  render: () => (
    <Select
      label="Choose an option"
      placeholder="Select an option"
      isInvalid
      errorMessage="Please select an option"
      className="max-w-xs"
    >
      <SelectItem key="option1">Option 1</SelectItem>
      <SelectItem key="option2">Option 2</SelectItem>
      <SelectItem key="option3">Option 3</SelectItem>
    </Select>
  ),
};

export const Required: Story = {
  render: () => (
    <Select label="Choose an option" placeholder="Select an option" isRequired className="max-w-xs">
      <SelectItem key="option1">Option 1</SelectItem>
      <SelectItem key="option2">Option 2</SelectItem>
      <SelectItem key="option3">Option 3</SelectItem>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select
      label="Choose an option"
      placeholder="Disabled select"
      isDisabled
      className="max-w-xs"
    >
      <SelectItem key="option1">Option 1</SelectItem>
      <SelectItem key="option2">Option 2</SelectItem>
      <SelectItem key="option3">Option 3</SelectItem>
    </Select>
  ),
};

export const MultipleSelection: Story = {
  render: () => (
    <Select
      label="Choose options"
      selectionMode="multiple"
      placeholder="Select multiple options"
      className="max-w-xs"
    >
      <SelectItem key="option1">Option 1</SelectItem>
      <SelectItem key="option2">Option 2</SelectItem>
      <SelectItem key="option3">Option 3</SelectItem>
      <SelectItem key="option4">Option 4</SelectItem>
    </Select>
  ),
};

export const WithSections: Story = {
  render: () => (
    <Select label="Choose an option" placeholder="Select an option" className="max-w-xs">
      <SelectSection title="Fruits">
        <SelectItem key="apple">Apple</SelectItem>
        <SelectItem key="banana">Banana</SelectItem>
        <SelectItem key="orange">Orange</SelectItem>
      </SelectSection>
      <SelectSection title="Vegetables">
        <SelectItem key="carrot">Carrot</SelectItem>
        <SelectItem key="broccoli">Broccoli</SelectItem>
        <SelectItem key="spinach">Spinach</SelectItem>
      </SelectSection>
    </Select>
  ),
};

export const WithClearButton: Story = {
  render: () => (
    <Select
      label="Choose an option"
      placeholder="Select an option"
      isClearable
      className="max-w-xs"
    >
      <SelectItem key="option1">Option 1</SelectItem>
      <SelectItem key="option2">Option 2</SelectItem>
      <SelectItem key="option3">Option 3</SelectItem>
    </Select>
  ),
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <Select size="sm" label="Small" placeholder="Select an option">
        <SelectItem key="option1">Option 1</SelectItem>
        <SelectItem key="option2">Option 2</SelectItem>
      </Select>
      <Select size="md" label="Medium" placeholder="Select an option">
        <SelectItem key="option1">Option 1</SelectItem>
        <SelectItem key="option2">Option 2</SelectItem>
      </Select>
      <Select size="lg" label="Large" placeholder="Select an option">
        <SelectItem key="option1">Option 1</SelectItem>
        <SelectItem key="option2">Option 2</SelectItem>
      </Select>
    </div>
  ),
};

export const DifferentVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <Select variant="flat" label="Flat" placeholder="Select an option">
        <SelectItem key="option1">Option 1</SelectItem>
        <SelectItem key="option2">Option 2</SelectItem>
      </Select>
      <Select variant="bordered" label="Bordered" placeholder="Select an option">
        <SelectItem key="option1">Option 1</SelectItem>
        <SelectItem key="option2">Option 2</SelectItem>
      </Select>
      <Select variant="faded" label="Faded" placeholder="Select an option">
        <SelectItem key="option1">Option 1</SelectItem>
        <SelectItem key="option2">Option 2</SelectItem>
      </Select>
      <Select variant="underlined" label="Underlined" placeholder="Select an option">
        <SelectItem key="option1">Option 1</SelectItem>
        <SelectItem key="option2">Option 2</SelectItem>
      </Select>
    </div>
  ),
};

export const DisabledItems: Story = {
  render: () => (
    <Select label="Choose an option" placeholder="Select an option" className="max-w-xs">
      <SelectItem key="option1">Option 1</SelectItem>
      <SelectItem key="option2" isDisabled>
        Option 2 (Disabled)
      </SelectItem>
      <SelectItem key="option3">Option 3</SelectItem>
    </Select>
  ),
};
