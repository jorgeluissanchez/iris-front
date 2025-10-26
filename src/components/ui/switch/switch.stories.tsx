import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Switch } from './switch';

const meta: Meta<typeof Switch> = {
  component: Switch,
  title: 'UI/Form/Switch',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: () => {
    const [isSelected, setIsSelected] = useState(false);
    return (
      <Switch isSelected={isSelected} onValueChange={setIsSelected}>
        Enable notifications
      </Switch>
    );
  },
};

export const WithLabel: Story = {
  render: () => {
    const [isSelected, setIsSelected] = useState(false);
    return (
      <Switch
        isSelected={isSelected}
        onValueChange={setIsSelected}
        value="notifications"
      >
        Enable push notifications
      </Switch>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [isSelected, setIsSelected] = useState(true);
    return (
      <Switch isSelected={isSelected} onValueChange={setIsSelected}>
        Advanced settings
      </Switch>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Switch isDisabled>Disabled unchecked</Switch>
      <Switch isDisabled defaultSelected>
        Disabled checked
      </Switch>
    </div>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Switch isReadOnly>Readonly unchecked</Switch>
      <Switch isReadOnly defaultSelected>
        Readonly checked
      </Switch>
    </div>
  ),
};

export const DifferentSizes: Story = {
  render: () => {
    const [small, setSmall] = useState(false);
    const [medium, setMedium] = useState(false);
    const [large, setLarge] = useState(false);

    return (
      <div className="flex flex-col gap-4">
        <Switch size="sm" isSelected={small} onValueChange={setSmall}>
          Small switch
        </Switch>
        <Switch size="md" isSelected={medium} onValueChange={setMedium}>
          Medium switch
        </Switch>
        <Switch size="lg" isSelected={large} onValueChange={setLarge}>
          Large switch
        </Switch>
      </div>
    );
  },
};

export const DifferentColors: Story = {
  render: () => {
    const [defaultColor, setDefaultColor] = useState(false);
    const [primary, setPrimary] = useState(false);
    const [secondary, setSecondary] = useState(false);
    const [success, setSuccess] = useState(false);
    const [warning, setWarning] = useState(false);
    const [danger, setDanger] = useState(false);

    return (
      <div className="flex flex-col gap-4">
        <Switch color="default" isSelected={defaultColor} onValueChange={setDefaultColor}>
          Default
        </Switch>
        <Switch color="primary" isSelected={primary} onValueChange={setPrimary}>
          Primary
        </Switch>
        <Switch color="secondary" isSelected={secondary} onValueChange={setSecondary}>
          Secondary
        </Switch>
        <Switch color="success" isSelected={success} onValueChange={setSuccess}>
          Success
        </Switch>
        <Switch color="warning" isSelected={warning} onValueChange={setWarning}>
          Warning
        </Switch>
        <Switch color="danger" isSelected={danger} onValueChange={setDanger}>
          Danger
        </Switch>
      </div>
    );
  },
};

export const WithThumbIcon: Story = {
  render: () => {
    const [isSelected, setIsSelected] = useState(false);
    return (
      <Switch
        isSelected={isSelected}
        onValueChange={setIsSelected}
        thumbIcon={({ isSelected, className }) => (
          <div className={className}>
            {isSelected ? '✅' : '❌'}
          </div>
        )}
      >
        Custom thumb icon
      </Switch>
    );
  },
};

export const WithIcons: Story = {
  render: () => {
    const [isSelected, setIsSelected] = useState(false);
    return (
      <Switch
        isSelected={isSelected}
        onValueChange={setIsSelected}
        startContent={<span className="text-gray-500">🌙</span>}
        endContent={<span className="text-yellow-500">☀️</span>}
      >
        Dark mode
      </Switch>
    );
  },
};

export const DefaultSelected: Story = {
  render: () => <Switch defaultSelected>Enabled by default</Switch>,
};
